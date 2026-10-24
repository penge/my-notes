import { Sync } from "shared/storage/schema";

import { havingPermission } from "shared/permissions";
import { setItem } from "shared/storage";
import Log from "shared/log";

import * as api from "../api";

export default async (): Promise<Sync | undefined> => {
  const allowed = await havingPermission("identity");
  if (!allowed) {
    Log("SYNC_INITIATE - PROBLEM - not having a permission");
    return undefined;
  }

  // Get folder ID; a failed lookup must not end in a second "My Notes" folder
  const existingFolderId = await api.getMyNotesFolderId();
  if (existingFolderId === undefined) {
    Log("SYNC_INITIATE - PROBLEM - cannot look up the folder");
    return undefined;
  }

  const folderId = existingFolderId || await api.createMyNotesFolder();
  if (!folderId) {
    Log("SYNC_INITIATE - PROBLEM - cannot create the folder");
    return undefined;
  }
  const folderLocation = `https://drive.google.com/drive/u/0/folders/${folderId}`;

  // Get assets folder ID
  const existingAssetsFolderId = await api.getAssetsFolderId(folderId);
  if (existingAssetsFolderId === undefined) {
    Log("SYNC_INITIATE - PROBLEM - cannot look up the assets folder");
    return undefined;
  }

  const assetsFolderId = existingAssetsFolderId || await api.createAssetsFolder(folderId);

  const sync: Sync = {
    folderId,
    folderLocation,
    assetsFolderId,
  };

  await setItem<Sync>("sync", sync);
  return sync;
};
