import { NotesObject, Note, GoogleDriveFile } from "shared/storage/schema";
import Log from "shared/log";
import { GetFileFunction, DownloadError } from "background/google-drive/api";

const prepareNote = (existingNote: Note, content: string, file: GoogleDriveFile): Note => ({
  ...existingNote,
  content,
  createdTime: file.createdTime,
  modifiedTime: file.modifiedTime,
  sync: {
    file: {
      id: file.id,
      name: file.name,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
    },
  },
});

export const mergeContent = (noteContent: string, fileContent: string) => `${noteContent}<br><br>${fileContent}`;

const updateNote = async (
  notes: NotesObject,
  syncedNote: Note,
  file: GoogleDriveFile,
  getFile: GetFileFunction,
  contentResolution: "replace" | "merge",
) => {
  const notesCopy: NotesObject = { ...notes };

  const previousNoteName = Object.keys(notesCopy).find((key) => notesCopy[key] === syncedNote);
  const fileContent = await getFile(file.id);
  if (fileContent === undefined) {
    throw new DownloadError(file.name);
  }

  // The note follows its file's new name, unless another note already has
  // that name; that note is not overwritten, and the note keeps its name
  const nameTaken = file.name in notesCopy && notesCopy[file.name] !== syncedNote;
  const noteName = nameTaken && previousNoteName ? previousNoteName : file.name;

  // eslint-disable-next-line max-len
  Log(`SYNC - IN - UPDATING NOTE - ${noteName} (name before: ${previousNoteName || file.name}, note MT: ${syncedNote.modifiedTime}, file MT: ${file.modifiedTime})`, "blue");
  notesCopy[noteName] = prepareNote(
    syncedNote,
    contentResolution === "replace" ? fileContent : mergeContent(syncedNote.content, fileContent),
    file,
  );

  if (previousNoteName && previousNoteName !== noteName) {
    delete notesCopy[previousNoteName];
  }

  return notesCopy;
};

export default async (notes: NotesObject, remoteFiles: GoogleDriveFile[], getFile: GetFileFunction): Promise<NotesObject> => {
  let notesCopy: NotesObject = { ...notes };

  // eslint-disable-next-line no-restricted-syntax
  for await (const file of remoteFiles) {
    const syncedNote = Object.values(notes).find((note) => note.sync?.file.id === file.id);

    if (
      syncedNote && syncedNote.sync // note is synced
      && syncedNote.modifiedTime === syncedNote.sync.file.modifiedTime // note is NOT modified since the last sync
      && file.modifiedTime > syncedNote.modifiedTime // file is modified since the last sync
    ) {
      notesCopy = await updateNote(notesCopy, syncedNote, file, getFile, "replace");
    }

    if (
      syncedNote && syncedNote.sync // note is synced
      && syncedNote.modifiedTime !== syncedNote.sync.file.modifiedTime // note is modified since the last sync
      && file.modifiedTime > syncedNote.modifiedTime // file is modified since the last sync, file is the latest update
    ) {
      notesCopy = await updateNote(notesCopy, syncedNote, file, getFile, "merge");
    }

    if (
      !syncedNote && file.name in notesCopy && !notesCopy[file.name].sync // note is NOT synced, not even to another file of the same name
      && notesCopy[file.name].modifiedTime === file.modifiedTime // note and file have the same modified time
    ) {
      Log(`SYNC - IN - CONNECTING NOTE - ${file.name} (note MT: ${notesCopy[file.name].modifiedTime}, file MT: ${file.modifiedTime})`, "blue");
      notesCopy[file.name] = prepareNote(
        notesCopy[file.name],
        notesCopy[file.name].content,
        file,
      );
    }

    if (
      !syncedNote && file.name in notesCopy && !notesCopy[file.name].sync // note is NOT synced, not even to another file of the same name
      && notesCopy[file.name].modifiedTime !== file.modifiedTime // note and file do NOT have the same modified time
    ) {
      const fileContent = await getFile(file.id);
      if (fileContent === undefined) {
        throw new DownloadError(file.name);
      }

      Log(`SYNC - IN - UPDATING NOTE - ${file.name} (note MT: ${notesCopy[file.name].modifiedTime}, file MT: ${file.modifiedTime})`, "blue");
      notesCopy[file.name] = prepareNote(
        notesCopy[file.name],
        mergeContent(notesCopy[file.name].content, fileContent),
        file,
      );
    }
  }

  return notesCopy;
};
