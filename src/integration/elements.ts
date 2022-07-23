const get = (ID: string): HTMLElement => {
  const elem = document.getElementById(ID);
  if (!elem) {
    throw new Error(`Element ${ID} not found!`);
  }
  return elem;
};

/* Folder */

const createMyNotesFolder = get("create-my-notes-folder");
const getMyNotesFolderId = get("get-my-notes-folder-id");

/* Files */

const createFile = get("create-file");
const updateFile = get("update-file");
const deleteFile = get("delete-file");

const listFiles = get("list-files");
const getFile = get("get-file");

/* Backup */

const initiate = get("initiate");
const sync = get("sync");
const stop = get("stop");

export default {
  // Folder
  createMyNotesFolder,
  getMyNotesFolderId,

  // Files
  createFile,
  updateFile,
  deleteFile,

  listFiles,
  getFile,

  // Backup
  initiate,
  sync,
  stop,
};
