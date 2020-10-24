import {
  createFolderBody,
  createFileBody,
  updateFileBody,
} from "./bodies.js";

import { listFoldersQuery, listFilesQuery } from "./queries.js";
import files from "./files/index.js";

const createMyNotesFolder = async () => {
  const body = createFolderBody("My Notes");
  const json = await files.create(body);
  const folderId = json && json.id;
  return folderId;
};

const getMyNotesFolderId = async () => {
  const query = listFoldersQuery("My Notes");
  const fields = "files(id)";
  const json = await files.list(query, fields);
  const folderId = json && json.files && json.files[0] && json.files[0].id;
  return folderId;
};

const createFile = async (folderId, { name, content, createdTime, modifiedTime }) => {
  const body = createFileBody(folderId, { name, content, createdTime, modifiedTime });
  const json = await files.create(body);
  const id = json && json.id;
  return { id, name, content, createdTime, modifiedTime };
};

const updateFile = async (fileId, { name, content, modifiedTime }) => {
  const body = updateFileBody({ name, content, modifiedTime });
  const json = await files.update(fileId, body);
  const id = json && json.id;
  return { id, name, content, modifiedTime };
};

const deleteFile = async (fileId) => {
  const response = await files.delete(fileId);
  return response && response.ok && fileId;
};

const listFiles = async (folderId) => {
  const query = listFilesQuery(folderId);
  const fields = "files(id,name,createdTime,modifiedTime)";
  const json = await files.list(query, fields);
  return json && json.files;
};

const getFile = async (fileId) => {
  const file = await files.get(fileId);
  return file;
};

export default {
  createMyNotesFolder,
  getMyNotesFolderId,
  createFile,
  updateFile,
  deleteFile,
  listFiles,
  getFile,
};
