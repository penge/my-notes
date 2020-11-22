import { Sync } from "shared/storage/schema";

import { havingPermission } from "shared/permissions/index";
import { setItem } from "shared/storage/index";

import * as api from "../api";

export default async (): Promise<Sync | undefined> => {
  const allowed = await havingPermission("identity");
  if (!allowed) {
    return;
  }

  // Get folder ID
  const folderId = await api.getMyNotesFolderId() || await api.createMyNotesFolder();
  if (!folderId) {
    return;
  }
  const folderLocation = `https://drive.google.com/drive/u/0/folders/${folderId}`;

  const sync: Sync = {
    folderId,
    folderLocation,
  };

  await setItem<Sync>("sync", sync);
  return sync;
};
