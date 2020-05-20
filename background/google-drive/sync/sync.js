/* global navigator, console */

import { havingPermission } from "../../../shared/permissions/index.js";
import { getItem, setItem } from "../../../shared/storage/index.js";
import api from "../api.js";

import stop from "./stop.js";
import pull from "./pull.js";
import push from "./push.js";

// File actions
const getFile = api.getFile;
const createFile = api.createFile;
const updateFile = api.updateFile;
const deleteFile = api.deleteFile;

const runPreconditions = async (PREFIX) => {
  // Check if having the Internet connection
  if (!navigator.onLine) {
    console.log(`${PREFIX} - PROBLEM - not connected to the Internet`);
    return false; // We are offline
  }

  // Check if having the permission
  const allowed = await havingPermission("identity");
  if (!allowed) {
    console.log(`${PREFIX} - PROBLEM - not having a permission`);
    return false;
  }

  // Check if folderId is set
  const sync = await getItem("sync");
  if (typeof sync !== "object" || typeof sync.folderId !== "string") {
    console.log(`${PREFIX} - PROBLEM - folderId not set`);
    await stop(); // STOP synchronization, cannot continue without folderId
    return false;
  }

  // Check if folderLocation is set
  if (typeof sync !== "object" && sync.folderLocation !== `https://drive.google.com/drive/u/0/folders/${folderId}`) {
    console.log(`${PREFIX} - PROBLEM - folderLocation not correct`);
    await stop(); // STOP synchronization; folderLocation was modified
    return false;
  }

  // Check if "My Notes" folder exists
  const folderId = await api.getMyNotesFolderId();
  if (!folderId || folderId !== sync.folderId) {
    await stop(); // STOP synchronization; "My Notes" folder was deleted, or folderId was modified
    return false;
  }

  // Check if can retrieve the files list
  const files = await api.listFiles(folderId);
  if (!Array.isArray(files)) {
    console.log(`${PREFIX} - PROBLEM - cannot retrieve files`);
    await stop();
    return false;
  }

  // All Good
  return {
    folderId: sync.folderId,
    folderLocation: sync.folderLocation,
    files,
  };
};

const sync = async () => {
  const fulfilled = await runPreconditions("SYNC");
  if (!fulfilled) {
    return;
  }

  const { folderId, folderLocation, files } = fulfilled;
  const notes = await getItem("notes");

  console.log("SYNC - START");
  const notesAfterPull = await pull(notes, files, { getFile });
  const notesAfterPush = await push(folderId, notesAfterPull, files, { createFile, updateFile });
  await setItem("notes", notesAfterPush);
  await setItem("sync", { folderId, folderLocation, files, lastSync: new Date().toISOString() });
  console.log("SYNC - DONE");

  return true;
};

const syncDeleteFile = async (fileId) => {
  const fulfilled = await runPreconditions("SYNC_DELETE_FILE");
  if (!fulfilled) {
    return;
  }

  const { files } = fulfilled;
  const fileExists = fileId && files.find(file => file.id === fileId) !== undefined;
  if (!fileExists) {
    console.log(`SYNC_DELETE_FILE - PROBLEM - cannot delete file with ID ${fileId}`);
    return;
  }

  console.log(`%cSYNC_DELETE_FILE - DELETING FILE - ${fileId}`, "color: red");
  await deleteFile(fileId);
};

export {
  sync,
  syncDeleteFile,
};
