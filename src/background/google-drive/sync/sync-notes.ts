import {
  NotesObject, GoogleDriveFile, Sync, SyncLookup,
} from "shared/storage/schema";
import Log from "shared/log";
import { GetFileFunction, GoogleDriveFileUpdate } from "../api";
import { CreateFileBodyOptions, UpdateFileBodyOptions } from "../bodies";

import pull from "./pull";
import push from "./push";
import merge, { orphanedFileIds } from "./merge";

// Google Drive and storage, passed in so a sync run can be tested end to end
export interface SyncNotesDeps {
  drive: {
    getFile: GetFileFunction
    createFile: (folderId: string, options: CreateFileBodyOptions) => Promise<GoogleDriveFile>
    updateFile: (fileId: string, options: UpdateFileBodyOptions) => Promise<GoogleDriveFileUpdate>
    deleteFile: (fileId: string) => Promise<boolean>
  }
  storage: {
    getItem: <T>(key: string) => Promise<T | undefined>
    setItems: (items: Record<string, unknown>) => Promise<void>
  }
}

// Pulls from and pushes to Google Drive, then stores the result. Returns
// whether the result was stored, and throws on any failure
export default async (
  {
    folderId, folderLocation, assetsFolderId, files,
  }: SyncLookup,
  { drive, storage }: SyncNotesDeps,
): Promise<boolean> => {
  // `lastSync` is the time the notes were read. A content edit made while
  // sync is running is then newer than `lastSync`, so Auto Sync pushes it next.
  const lastSync = new Date().toISOString();
  const notes = await storage.getItem<NotesObject>("notes");
  if (!notes) {
    return false;
  }

  const notesAfterPull = await pull(notes, files, drive);
  const notesAfterPush = await push(folderId, notesAfterPull, drive);

  // The user stopped sync while it was running, which removed `sync` and
  // unlinked every note; writing the result would undo that
  if (!(await storage.getItem<Sync>("sync"))) {
    Log("SYNC - STOPPED MEANWHILE");
    return false;
  }

  // The user may have edited notes while pull and push were running; keep
  // those edits instead of overwriting them with the notes before sync. If
  // the notes cannot be read now, nothing is known to have changed, so the
  // notes before sync are used. No request runs between this read and the
  // write below, but a save from the editor landing in between is still
  // overwritten, as `chrome.storage` has no transactions
  const notesCurrent = (await storage.getItem<NotesObject>("notes")) || notes;
  const mergedNotes = merge(notes, notesAfterPush, notesCurrent);

  await storage.setItems({
    notes: mergedNotes,
    sync: {
      folderId,
      folderLocation,
      assetsFolderId,
      lastSync,
    },
    setBy: `sync-${lastSync}`,
  });

  // A file created by this push for a note the user deleted or renamed
  // meanwhile is held by no note, so it is removed before the next sync
  // would pull it back as a new note
  const orphans = orphanedFileIds(files.map((file) => file.id), notesAfterPush, mergedNotes);
  await Promise.all(orphans.map((fileId) => {
    Log(`SYNC - OUT - DELETING ORPHANED FILE - ${fileId}`, "red");
    return drive.deleteFile(fileId);
  }));

  return true;
};
