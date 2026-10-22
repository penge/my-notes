import { MessageType } from "shared/storage/schema";
import { getItem, setItems } from "shared/storage";
import sendMessage from "shared/messages/send";
import Log from "shared/log";

import runSyncPreconditions from "../preconditions/run-sync-preconditions";

import syncNotes from "./sync-notes";

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
    const synced = await syncNotes(fulfilled, {
      drive: {
        getFile, createFile, updateFile, deleteFile,
      },
      storage: { getItem, setItems },
    });
    onDone();
    return synced;
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
