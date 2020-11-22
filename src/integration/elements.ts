import { getElementById as _get } from "dom/index";

/* Folder */

const createMyNotesFolder = _get("create-my-notes-folder");
const getMyNotesFolderId = _get("get-my-notes-folder-id");

/* Files */

const createFile = _get("create-file");
const updateFile = _get("update-file");
const deleteFile = _get("delete-file");

const listFiles = _get("list-files");
const getFile = _get("get-file");

/* Backup */

const initiate = _get("initiate");
const sync = _get("sync");
const stop = _get("stop");

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
