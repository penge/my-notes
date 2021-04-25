import { NotesObject, MessageType } from "shared/storage/schema";
import { getItem, setItem } from "shared/storage/index";
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

const sync = async (): Promise<boolean> => {
  const fulfilled = await runSyncPreconditions("SYNC");
  if (!fulfilled) {
    sendMessage(MessageType.SYNC_FAIL);
    return false;
  }

  const { folderId, folderLocation, files } = fulfilled;
  const notes = await getItem<NotesObject>("notes");
  if (!notes) {
    return false;
  }

  Log("SYNC - START");
  sendMessage(MessageType.SYNC_START);

  const notesAfterPull = await pull(notes, files, { getFile });
  const notesAfterPush = await push(folderId, notesAfterPull, { createFile, updateFile });
  await setItem("notes", notesAfterPush);
  await setItem("sync", { folderId, folderLocation, files, lastSync: new Date().toISOString() });

  Log("SYNC - DONE");
  sendMessage(MessageType.SYNC_DONE);

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
