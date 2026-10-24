import { GoogleDriveFile } from "shared/storage/schema";

import {
  createFolderBody,
  createFileBody,
  updateFileBody,
  CreateFileBodyOptions,
  UpdateFileBodyOptions,
} from "./bodies";

import { listFoldersQuery, listFilesQuery } from "./queries";
import * as files from "./files";

const createFolder = async (folderName: string, parent?: string): Promise<string> => {
  const body = createFolderBody(folderName, parent);
  const json = await files.create(body) as { id: string };
  const folderId = json && json.id;
  return folderId;
};

// Returns the folder ID, null if there is no such folder, or undefined if
// the request failed, so a transient error is not mistaken for a missing
// folder
const getFolder = async (folderName: string, parent?: string): Promise<string | null | undefined> => {
  const query = listFoldersQuery(folderName, parent);
  const fields = "files(id)";
  const json = await files.list(query, fields) as { files?: { id: string }[] } | undefined;
  if (!json || !Array.isArray(json.files)) {
    return undefined;
  }

  return json.files[0]?.id ?? null;
};

export const createMyNotesFolder = (): Promise<string> => createFolder("My Notes");
export const getMyNotesFolderId = (): Promise<string | null | undefined> => getFolder("My Notes");

export const createAssetsFolder = (parent: string): Promise<string> => createFolder("assets", parent);
export const getAssetsFolderId = (parent: string): Promise<string | null | undefined> => getFolder("assets", parent);

export const createFile = async (
  folderId: string,
  {
    name, content, createdTime, modifiedTime,
  }: CreateFileBodyOptions,
): Promise<GoogleDriveFile> => {
  const body = createFileBody(folderId, {
    name, content, createdTime, modifiedTime,
  });
  const json = await files.create(body) as { id: string };
  const id = json && json.id;
  return {
    id, name, content, createdTime, modifiedTime,
  };
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
  return {
    id, name, content, modifiedTime,
  };
};

export const deleteFile = async (fileId: string): Promise<boolean> => {
  const response = await files.delete(fileId);
  return response?.ok ?? false;
};

// Returns every file in the folder, or undefined if any page could not be
// retrieved. A partial listing must never be returned, as sync treats a file
// missing from the listing as deleted in Google Drive.
export const listFiles = async (folderId: string): Promise<GoogleDriveFile[] | undefined> => {
  const query = listFilesQuery(folderId);
  const fields = "nextPageToken,files(id,name,createdTime,modifiedTime)";
  const pageSize = 1000;
  const allFiles: GoogleDriveFile[] = [];
  let pageToken: string | undefined;

  do {
    // eslint-disable-next-line no-await-in-loop
    const json = await files.list(query, fields, pageSize, pageToken) as { files?: GoogleDriveFile[], nextPageToken?: string } | undefined;
    if (!json || !Array.isArray(json.files)) {
      return undefined;
    }

    allFiles.push(...json.files);
    pageToken = json.nextPageToken;
  } while (pageToken);

  return allFiles;
};

export type GetFileFunction = (fileId: string) => Promise<string | undefined>;

// Thrown by pull when a file cannot be downloaded. Acting on the rest of the
// pull could push local content over a remote edit that was not fetched, or
// create a duplicate of a file that was not linked, so the sync run fails
export class DownloadError extends Error {}

export const getFile: GetFileFunction = async (fileId: string): Promise<string | undefined> => {
  const file = await files.get(fileId);
  return file;
};
