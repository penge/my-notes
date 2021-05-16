import { SyncLookup } from "shared/storage/schema";
import { Log } from "shared/logger";
import { runCommonPreconditions } from "./common-preconditions";

import stop from "../sync/stop";
import * as api from "../api";

export const runSyncPreconditions = async (PREFIX: string): Promise<SyncLookup | undefined> => {
  const sync = await runCommonPreconditions(PREFIX);
  if (!sync) {
    return;
  }

  // Check if "My Notes" folder exists
  const folderId = await api.getMyNotesFolderId();
  if (!folderId || folderId !== sync.folderId) {
    await stop(); // STOP synchronization; "My Notes" folder was deleted, or folderId was modified
    return;
  }

  // Check if folderLocation is set
  if (sync.folderLocation !== `https://drive.google.com/drive/u/0/folders/${folderId}`) {
    Log(`${PREFIX} - PROBLEM - folderLocation not correct`);
    await stop(); // STOP synchronization; folderLocation was modified
    return;
  }

  // Check if can retrieve the files list
  const files = await api.listFiles(sync.folderId);
  if (!Array.isArray(files)) {
    Log(`${PREFIX} - PROBLEM - cannot retrieve files`);
    await stop();
    return;
  }

  // All Good
  return {
    ...sync,
    files,
  };
};
