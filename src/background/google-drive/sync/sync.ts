import { NotesObject, Sync, SyncLookup, MessageType } from "shared/storage/schema";

import { havingPermission } from "shared/permissions/index";
import { getItem, setItem } from "shared/storage/index";
import * as api from "../api";

import stop from "./stop";
import pull from "./pull";
import push from "./push";

import { sendMessage } from "messages/index";

// File actions
const getFile = api.getFile;
const createFile = api.createFile;
const updateFile = api.updateFile;
const deleteFile = api.deleteFile;

const runPreconditions = async (PREFIX: string): Promise<SyncLookup | undefined> => {
  // Check if having the Internet connection
  if (!navigator.onLine) {
    console.log(`${PREFIX} - PROBLEM - not connected to the Internet`);
    return; // We are offline
  }

  // Check if having the permission
  const allowed = await havingPermission("identity");
  if (!allowed) {
    console.log(`${PREFIX} - PROBLEM - not having a permission`);
    return;
  }

  const sync = await getItem<Sync>("sync");

  // Check if sync exists
  if (!sync) {
    console.log(`${PREFIX} - PROBLEM - sync not set`);
    await stop(); // STOP synchronization, cannot continue without sync
    return;
  }

  // Check if folderId is set
  if (!sync.folderId) {
    console.log(`${PREFIX} - PROBLEM - folderId not set`);
    await stop(); // STOP synchronization, cannot continue without folderId
    return;
  }

  // Check if "My Notes" folder exists
  const folderId = await api.getMyNotesFolderId();
  if (!folderId || folderId !== sync.folderId) {
    await stop(); // STOP synchronization; "My Notes" folder was deleted, or folderId was modified
    return;
  }

  // Check if folderLocation is set
  if (sync.folderLocation !== `https://drive.google.com/drive/u/0/folders/${folderId}`) {
    console.log(`${PREFIX} - PROBLEM - folderLocation not correct`);
    await stop(); // STOP synchronization; folderLocation was modified
    return;
  }

  // Check if can retrieve the files list
  const files = await api.listFiles(folderId);
  if (!Array.isArray(files)) {
    console.log(`${PREFIX} - PROBLEM - cannot retrieve files`);
    await stop();
    return;
  }

  // All Good
  return {
    ...sync,
    files,
  };
};

const sync = async (): Promise<boolean> => {
  const fulfilled = await runPreconditions("SYNC");
  if (!fulfilled) {
    sendMessage(MessageType.SYNC_FAIL);
    return false;
  }

  const { folderId, folderLocation, files } = fulfilled;
  const notes = await getItem<NotesObject>("notes");
  if (!notes) {
    return false;
  }

  console.log("SYNC - START");
  sendMessage(MessageType.SYNC_START);

  const notesAfterPull = await pull(notes, files, { getFile });
  const notesAfterPush = await push(folderId, notesAfterPull, { createFile, updateFile });
  await setItem("notes", notesAfterPush);
  await setItem("sync", { folderId, folderLocation, files, lastSync: new Date().toISOString() });

  console.log("SYNC - DONE");
  sendMessage(MessageType.SYNC_DONE);

  return true;
};

const syncDeleteFile = async (fileId: string): Promise<boolean> => {
  const fulfilled = await runPreconditions("SYNC_DELETE_FILE");
  if (!fulfilled) {
    return false;
  }

  const { files } = fulfilled;
  const fileExists = fileId && files.find(file => file.id === fileId) !== undefined;
  if (!fileExists) {
    console.log(`SYNC_DELETE_FILE - PROBLEM - cannot delete file with ID ${fileId}`);
    return false;
  }

  console.log(`%cSYNC_DELETE_FILE - DELETING FILE - ${fileId}`, "color: red");
  return await deleteFile(fileId);
};

export {
  sync,
  syncDeleteFile,
};
