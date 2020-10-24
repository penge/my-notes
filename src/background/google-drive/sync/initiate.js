import { requestPermission } from "../../../shared/permissions/index.js";
import api from "../api.js";
import { setItem } from "../../../shared/storage/index.js";

export default async () => {
  const granted = await requestPermission("identity");
  if (!granted) {
    return false;
  }

  // Get folder ID
  const folderId = await api.getMyNotesFolderId() || await api.createMyNotesFolder();
  if (!folderId) {
    return false;
  }
  const folderLocation = `https://drive.google.com/drive/u/0/folders/${folderId}`;

  const sync = {
    folderId,
    folderLocation,
  };

  await setItem("sync", sync);
  return sync;
};
