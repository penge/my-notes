import { Sync } from "shared/storage/schema";

import { havingPermission } from "shared/permissions";
import { setItem } from "shared/storage";

import * as api from "../api";

export default async (): Promise<Sync | undefined> => {
  const allowed = await havingPermission("identity");
  if (!allowed) {
    return undefined;
  }

  // Get folder ID
  const folderId = await api.getMyNotesFolderId() || await api.createMyNotesFolder();
  if (!folderId) {
    return undefined;
  }
  const folderLocation = `https://drive.google.com/drive/u/0/folders/${folderId}`;

  // Get assets folder ID
  const assetsFolderId = await api.getAssetsFolderId(folderId) || await api.createAssetsFolder(folderId);

  const sync: Sync = {
    folderId,
    folderLocation,
    assetsFolderId,
  };

  await setItem<Sync>("sync", sync);
  return sync;
};
