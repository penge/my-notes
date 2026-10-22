import { SyncLookup } from "shared/storage/schema";
import getAuthToken from "shared/identity/get-auth-token";
import Log from "shared/log";
import runCommonPreconditions from "./run-common-preconditions";

import stop from "../sync/stop";
import * as api from "../api";

export default async (PREFIX: string): Promise<SyncLookup | undefined> => {
  const sync = await runCommonPreconditions(PREFIX);
  if (!sync) {
    return undefined;
  }

  // Check if signed in. A declined sign-in stops sync, so the user is not
  // asked again on every Auto Sync run
  const token = await getAuthToken();
  if (!token) {
    Log(`${PREFIX} - PROBLEM - not signed in`);
    await stop();
    return undefined;
  }

  // Check if "My Notes" folder exists. A failed lookup is transient, so sync
  // is skipped this time and retried later, not stopped
  const folderId = await api.getMyNotesFolderId();
  if (folderId === undefined) {
    Log(`${PREFIX} - PROBLEM - cannot look up the folder`);
    return undefined;
  }

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

  // Check if can retrieve the files list. A failed listing is transient
  // (network, Google error page), so sync is skipped this time and retried
  // later, not stopped
  const files = await api.listFiles(sync.folderId);
  if (!files) {
    Log(`${PREFIX} - PROBLEM - cannot retrieve files`);
    return undefined;
  }

  // All Good
  return {
    ...sync,
    files,
  };
};
