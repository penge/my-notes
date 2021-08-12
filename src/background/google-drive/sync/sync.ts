import { NotesObject, MessageType } from "shared/storage/schema";
import { getItem, setItems } from "shared/storage/index";
import { sendMessage } from "messages/index";

import { runSyncPreconditions } from "../preconditions/sync-preconditions";

import pull from "./pull";
import push from "./push";

import * as api from "../api";
import { Log } from "shared/logger";

// File actions
const getFile = api.getFile;
const createFile = api.createFile;
const updateFile = api.updateFile;
const deleteFile = api.deleteFile;

let syncInProgress = false;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  delay(1500).then(() => syncInProgress = false); // prevent to sync more often than 1x per 1500ms
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

  const { folderId, folderLocation, assetsFolderId, files } = fulfilled;
  const notes = await getItem<NotesObject>("notes");
  if (!notes) {
    onDone();
    return false;
  }

  const notesAfterPull = await pull(notes, files, { getFile });
  const notesAfterPush = await push(folderId, notesAfterPull, { createFile, updateFile });

  const lastSync = new Date().toISOString();

  await setItems({
    notes: notesAfterPush,
    sync: {
      folderId,
      folderLocation,
      assetsFolderId,
      lastSync,
    },
    setBy: `sync-${lastSync}`,
  });

  onDone();
  return true;
};

const syncDeleteFile = async (fileId: string): Promise<boolean> => {
  const fulfilled = await runSyncPreconditions("SYNC_DELETE_FILE");
  if (!fulfilled) {
    return false;
  }

  const { files } = fulfilled;
  const fileExists = fileId && files.find(file => file.id === fileId) !== undefined;
  if (!fileExists) {
    Log(`SYNC_DELETE_FILE - PROBLEM - cannot delete file with ID ${fileId}`);
    return false;
  }

  Log(`%cSYNC_DELETE_FILE - DELETING FILE - ${fileId}`, "red");
  return await deleteFile(fileId);
};

export {
  sync,
  syncDeleteFile,
};
