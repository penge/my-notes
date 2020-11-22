import { GoogleDriveFile } from "shared/storage/schema";

import {
  createFolderBody,
  createFileBody,
  updateFileBody,
  CreateFileBodyOptions,
  UpdateFileBodyOptions,
} from "./bodies";

import { listFoldersQuery, listFilesQuery } from "./queries";
import files from "./files/index";

export const createMyNotesFolder = async (): Promise<string> => {
  const body = createFolderBody("My Notes");
  const json = await files.create(body) as { id: string };
  const folderId = json && json.id;
  return folderId;
};

export const getMyNotesFolderId = async (): Promise<string> => {
  const query = listFoldersQuery("My Notes");
  const fields = "files(id)";
  const json = await files.list(query, fields) as { files: {id: string}[] };
  const folderId = json && json.files && json.files[0] && json.files[0].id;
  return folderId;
};

export const createFile = async (folderId: string, { name, content, createdTime, modifiedTime }: CreateFileBodyOptions): Promise<GoogleDriveFile> => {
  const body = createFileBody(folderId, { name, content, createdTime, modifiedTime });
  const json = await files.create(body) as { id: string };
  const id = json && json.id;
  return { id, name, content, createdTime, modifiedTime };
};

export interface GoogleDriveFileUpdate {
  id: string
  name: string
  content: string
  modifiedTime: string
}

export const updateFile = async (fileId: string, { name, content, modifiedTime }: UpdateFileBodyOptions): Promise<GoogleDriveFileUpdate> => {
  const body = updateFileBody({ name, content, modifiedTime });
  const json = await files.update(fileId, body) as { id: string };
  const id = json && json.id;
  return { id, name, content, modifiedTime };
};

export const deleteFile = async (fileId: string): Promise<boolean> => {
  const response = await files.delete(fileId);
  if (!(response instanceof Response)) {
    return false;
  }
  return response.ok;
};

export const listFiles = async (folderId: string): Promise<GoogleDriveFile[]> => {
  const query = listFilesQuery(folderId);
  const fields = "files(id,name,createdTime,modifiedTime)";
  const json = await files.list(query, fields) as { files: [] };
  return json && json.files;
};

export const getFile = async (fileId: string): Promise<string | undefined> => {
  const file = await files.get(fileId);
  return file;
};
