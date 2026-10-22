import {
  NotesObject, MessageType, Sync, SyncLookup,
} from "shared/storage/schema";
import { getItem, setItems } from "shared/storage";
import sendMessage from "shared/messages/send";
import Log from "shared/log";

import runSyncPreconditions from "../preconditions/run-sync-preconditions";

import pull from "./pull";
import push from "./push";
import merge, { orphanedFileIds } from "./merge";

import * as api from "../api";

const { DownloadError } = api;

// File actions
const {
  getFile,
  createFile,
  updateFile,
  deleteFile,
} = api;

let syncInProgress = false;

const delay = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const onStart = () => {
  syncInProgress = true;
  Log("SYNC - START");
  sendMessage(MessageType.SYNC_START);
};

const onFail = () => {
  syncInProgress = false;
  Log("SYNC - FAIL");
  sendMessage(MessageType.SYNC_FAIL);
};

const onDone = () => {
  delay(2000).then(() => { syncInProgress = false; }); // prevent to sync more often than 1x per 2000ms
  Log("SYNC - DONE");
  sendMessage(MessageType.SYNC_DONE);
};

// Pulls from and pushes to Google Drive, then stores the result. Throws on
// any failure; `sync` ends the run
const syncNotes = async ({
  folderId, folderLocation, assetsFolderId, files,
}: SyncLookup): Promise<boolean> => {
  // `lastSync` is the time the notes were read. A content edit made while
  // sync is running is then newer than `lastSync`, so Auto Sync pushes it next.
  const lastSync = new Date().toISOString();
  const notes = await getItem<NotesObject>("notes");
  if (!notes) {
    onDone();
    return false;
  }

  const notesAfterPull = await pull(notes, files, { getFile });
  const notesAfterPush = await push(folderId, notesAfterPull, { createFile, updateFile });

  // The user stopped sync while it was running, which removed `sync` and
  // unlinked every note; writing the result would undo that
  if (!(await getItem<Sync>("sync"))) {
    Log("SYNC - STOPPED MEANWHILE");
    onDone();
    return false;
  }

  // The user may have edited notes while pull and push were running; keep
  // those edits instead of overwriting them with the notes before sync. If
  // the notes cannot be read now, nothing is known to have changed, so the
  // notes before sync are used. No request runs between this read and the
  // write below, but a save from the editor landing in between is still
  // overwritten, as `chrome.storage` has no transactions
  const notesCurrent = (await getItem<NotesObject>("notes")) || notes;
  const mergedNotes = merge(notes, notesAfterPush, notesCurrent);

  await setItems({
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
    return deleteFile(fileId);
  }));

  onDone();
  return true;
};

const sync = async (): Promise<boolean> => {
  if (syncInProgress) {
    Log("SYNC - ALREADY IN PROGRESS");
    return false;
  }

  onStart();

  const fulfilled = await runSyncPreconditions("SYNC");
  if (!fulfilled) {
    onFail();
    return false;
  }

  try {
    return await syncNotes(fulfilled);
  } catch (error) {
    // Any failure ends the run, so sync is not left marked as in progress
    const kind = error instanceof DownloadError ? "IN - CANNOT DOWNLOAD" : "FAILED";
    const detail = error instanceof Error ? error.message : String(error);
    Log(`SYNC - ${kind} - ${detail}`, "red");
    onFail();
    return false;
  }
};

const syncDeleteFile = async (fileId: string): Promise<boolean> => {
  const fulfilled = await runSyncPreconditions("SYNC_DELETE_FILE");
  if (!fulfilled) {
    return false;
  }

  const { files } = fulfilled;
  const fileExists = fileId && files.find((file) => file.id === fileId) !== undefined;
  if (!fileExists) {
    Log(`SYNC_DELETE_FILE - PROBLEM - cannot delete file with ID ${fileId}`);
    return false;
  }

  Log(`%cSYNC_DELETE_FILE - DELETING FILE - ${fileId}`, "red");
  return deleteFile(fileId);
};

export {
  sync,
  syncDeleteFile,
};
