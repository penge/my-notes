import { Note, NotesObject } from "shared/storage/schema";
import { mergeContent } from "./pull/pull-update";

// Sync works on a copy of the notes while the user keeps editing in the
// meantime. Rather than writing that copy back over those edits, the sync
// result is merged into the notes as they are now.
//
// - `notesBeforeSync`: the notes as read from storage when sync started;
//   pull and push worked on this
// - `notesAfterSync`: `notesBeforeSync` after pull and push, i.e. what sync
//   wants to store
// - `notesCurrent`: the notes as they are in storage now that pull and push
//   have finished; differs from `notesBeforeSync` by whatever the user did in
//   the meantime
//
// Names can change on both sides meanwhile (the user renames, pull renames a
// note to follow its file), so a note is matched to its counterpart by the
// file it is linked to whenever it has a link, and by name otherwise.

// What the user did to a note while sync was running, told by comparing the
// note in `notesBeforeSync` with the note in `notesCurrent`
type UserAction = "untouched" | "edited" | "created" | "deleted";

const userAction = (noteBeforeSync: Note | undefined, noteCurrent: Note | undefined): UserAction => {
  if (!noteBeforeSync) {
    return noteCurrent ? "created" : "untouched"; // not in `notesCurrent` either: created by pull, the user did nothing
  }

  if (!noteCurrent) {
    return "deleted";
  }

  // Any change, not only a later time: a note pulled from another device
  // carries that device's clock, which can be ahead of this one
  return noteCurrent.modifiedTime !== noteBeforeSync.modifiedTime ? "edited" : "untouched";
};

const byFileId = (notes: NotesObject): Map<string, Note> => new Map(
  Object.values(notes).filter((note) => note.sync).map((note) => [note.sync!.file.id, note]),
);

export const fileIds = (notes: NotesObject): Set<string> => new Set(byFileId(notes).keys());

// What pull fetched from Google Drive for this note, if anything. When pull
// resolved two sides editing one note it already appended the fetched
// content to the content before sync, so only the fetched part is taken
const pulledContent = (noteBeforeSync: Note | undefined, noteAfterSync: Note): string | undefined => {
  const base = noteBeforeSync?.content ?? "";
  if (noteAfterSync.content === base) {
    return undefined;
  }

  const prefix = `${base}<br><br>`;
  return noteAfterSync.content.startsWith(prefix) ? noteAfterSync.content.slice(prefix.length) : noteAfterSync.content;
};

export default (notesBeforeSync: NotesObject, notesAfterSync: NotesObject, notesCurrent: NotesObject): NotesObject => {
  const merged: NotesObject = {};
  const names = new Set([...Object.keys(notesBeforeSync), ...Object.keys(notesAfterSync), ...Object.keys(notesCurrent)]);
  const actions = new Map([...names].map((noteName) => [noteName, userAction(notesBeforeSync[noteName], notesCurrent[noteName])]));
  const beforeSyncById = byFileId(notesBeforeSync);
  const afterSyncById = byFileId(notesAfterSync);
  const currentById = byFileId(notesCurrent);

  // The name the note linked to the same file had before sync, if pull
  // renamed it to follow its file in Google Drive
  const nameBeforePullRename = (noteName: string, noteAfterSync: Note): string | undefined => {
    const fileId = noteAfterSync.sync?.file.id;
    const noteBeforeSync = fileId && beforeSyncById.get(fileId);
    if (!noteBeforeSync || notesBeforeSync[noteName] === noteBeforeSync) {
      return undefined;
    }

    return Object.keys(notesBeforeSync).find((name) => notesBeforeSync[name] === noteBeforeSync);
  };

  // Notes the user edited or created meanwhile win, so they are placed first.
  // Content pulled from Google Drive meanwhile is appended, the way
  // `pullUpdate` resolves two sides editing one note. The file link comes
  // from the counterpart after sync so the next sync updates that file instead
  // of creating another one; if the file is gone in Google Drive, the link
  // is dropped so the next sync creates a new file. The new `modifiedTime`
  // makes the editor reload appended content and the next sync push the note
  actions.forEach((action, noteName) => {
    if (action !== "edited" && action !== "created") {
      return;
    }

    const { sync: currentLink, ...noteCurrent } = notesCurrent[noteName];
    const fileId = currentLink?.file.id;
    const sameName = notesAfterSync[noteName];
    const sameNameIsOther = sameName && nameBeforePullRename(noteName, sameName);
    const counterpart = (fileId && afterSyncById.get(fileId)) || (sameNameIsOther ? undefined : sameName);
    const noteBeforeSync = (fileId && beforeSyncById.get(fileId)) || notesBeforeSync[noteName];
    const pulled = counterpart && pulledContent(noteBeforeSync, counterpart);

    // Only renamed, not edited: nothing of the user's to keep, so the content
    // after sync applies as it is
    const contentUnchanged = noteBeforeSync && noteCurrent.content === noteBeforeSync.content;
    const content = pulled && contentUnchanged ? counterpart.content : noteCurrent.content;

    merged[noteName] = {
      ...noteCurrent,
      content: pulled && !contentUnchanged ? mergeContent(content, pulled) : content,
      modifiedTime: new Date().toISOString(),
      ...(counterpart?.sync && { sync: counterpart.sync }),
    };
  });

  // Nothing happened to the remaining notes meanwhile, so the note after
  // sync applies: pulled content, a file link from push, a note created by
  // pull from a new file in Google Drive, or no note at all because its file
  // was deleted in Google Drive
  const held = fileIds(merged);
  const deletedFileIds = new Set([...actions]
    .filter(([noteName, action]) => action === "deleted" && notesBeforeSync[noteName].sync)
    .map(([noteName]) => notesBeforeSync[noteName].sync!.file.id));

  actions.forEach((action, noteName) => {
    const noteAfterSync = notesAfterSync[noteName];
    if (action !== "untouched" || !noteAfterSync) {
      return;
    }

    // Pull renamed the note to follow its file in Google Drive while the
    // user edited, renamed or deleted it meanwhile; the renamed copy is
    // dropped, as the user's note already holds the file or the user deleted
    // it. A name the user still has is not a renamed copy, e.g. the original
    // of a duplicate made meanwhile
    const fileId = noteAfterSync.sync?.file.id;
    if (fileId && (held.has(fileId) || deletedFileIds.has(fileId)) && !notesCurrent[noteName]) {
      return;
    }

    // Lock, pin and raw are changed without touching `modifiedTime`, and sync
    // never changes them, so the current values are always the right ones,
    // including an unset one (e.g. unpinned); storage drops the key
    const noteCurrent = notesCurrent[noteName] || (fileId && currentById.get(fileId));
    merged[noteName] = noteCurrent ? {
      ...noteAfterSync, locked: noteCurrent.locked, pinnedTime: noteCurrent.pinnedTime, raw: noteCurrent.raw,
    } : noteAfterSync;
  });

  // Pull renamed a note to follow its file in Google Drive, and the user
  // created another note with that name meanwhile. The user's note keeps the
  // name, and the renamed note goes back to the name it had before sync
  Object.keys(notesAfterSync).forEach((noteName) => {
    const noteAfterSync = notesAfterSync[noteName];
    const oldName = actions.get(noteName) === "created" ? nameBeforePullRename(noteName, noteAfterSync) : undefined;
    if (!oldName || oldName in merged || actions.get(oldName) !== "untouched" || fileIds(merged).has(noteAfterSync.sync!.file.id)) {
      return;
    }

    const noteCurrent = notesCurrent[oldName];
    merged[oldName] = noteCurrent ? {
      ...noteAfterSync, locked: noteCurrent.locked, pinnedTime: noteCurrent.pinnedTime, raw: noteCurrent.raw,
    } : noteAfterSync;
  });

  return merged;
};

// Files created by this sync's push that no note holds after the merge,
// because the user deleted or renamed the note meanwhile. The next sync
// would pull them back as new notes
export const orphanedFileIds = (listedFileIds: string[], notesAfterSync: NotesObject, merged: NotesObject): string[] => {
  const listed = new Set(listedFileIds);
  const held = fileIds(merged);
  return [...fileIds(notesAfterSync)].filter((fileId) => !listed.has(fileId) && !held.has(fileId));
};
