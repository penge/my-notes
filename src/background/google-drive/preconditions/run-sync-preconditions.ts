import { SyncLookup } from "shared/storage/schema";
import Log from "shared/log";
import runCommonPreconditions from "./run-common-preconditions";

import stop from "../sync/stop";
import * as api from "../api";

export default async (PREFIX: string): Promise<SyncLookup | undefined> => {
  const sync = await runCommonPreconditions(PREFIX);
  if (!sync) {
    return undefined;
  }

  // Check if "My Notes" folder exists
  const folderId = await api.getMyNotesFolderId();
  if (!folderId || folderId !== sync.folderId) {
    await stop(); // STOP synchronization; "My Notes" folder was deleted, or folderId was modified
    return undefined;
  }

  // Check if folderLocation is set
  if (sync.folderLocation !== `https://drive.google.com/drive/u/0/folders/${folderId}`) {
    Log(`${PREFIX} - PROBLEM - folderLocation not correct`);
    await stop(); // STOP synchronization; folderLocation was modified
    return undefined;
  }

  // Check if can retrieve the files list
  const files = await api.listFiles(sync.folderId);
  if (!Array.isArray(files)) {
    Log(`${PREFIX} - PROBLEM - cannot retrieve files`);
    await stop();
    return undefined;
  }

  // All Good
  return {
    ...sync,
    files,
  };
};
