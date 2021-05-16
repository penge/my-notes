import { Sync } from "shared/storage/schema";
import { havingPermission } from "shared/permissions/index";
import { getItem } from "shared/storage/index";
import { Log } from "shared/logger";

import stop from "../sync/stop";

export const runCommonPreconditions = async (PREFIX: string): Promise<Sync | undefined> => {
  // Check if having the Internet connection
  if (!navigator.onLine) {
    Log(`${PREFIX} - PROBLEM - not connected to the Internet`);
    return; // We are offline
  }

  // Check if having the permission
  const allowed = await havingPermission("identity");
  if (!allowed) {
    Log(`${PREFIX} - PROBLEM - not having a permission`);
    return;
  }

  const sync = await getItem<Sync>("sync");

  // Check if sync exists
  if (!sync) {
    Log(`${PREFIX} - PROBLEM - sync not set`);
    await stop(); // STOP synchronization, cannot continue without sync
    return;
  }

  // Check if folderId is set
  if (!sync.folderId) {
    Log(`${PREFIX} - PROBLEM - folderId not set`);
    await stop(); // STOP synchronization, cannot continue without folderId
    return;
  }

  return sync;
};
