import { runCommonPreconditions } from "./common-preconditions";
import * as api from "../api";
import { getToken } from "shared/permissions/identity";
import { setItem } from "shared/storage";
import { Sync } from "shared/storage/schema";

interface UploadPreconditionsResult {
  sync: Sync
  token: string
}

export const runUploadPreconditions = async (): Promise<UploadPreconditionsResult | undefined> => {
  const sync = await runCommonPreconditions("UPLOAD");
  if (!sync) {
    return;
  }

  // Get existing "assets" folder ID, or create "assets" folder if not found
  const assetsFolderId = sync.assetsFolderId || await api.getAssetsFolderId(sync.folderId) || await api.createAssetsFolder(sync.folderId);
  if (sync.assetsFolderId !== assetsFolderId) {
    await setItem("sync", {
      ...sync,
      assetsFolderId,
    });
  }

  const token = await getToken();
  if (!token) {
    return;
  }

  return {
    sync: {
      ...sync,
      assetsFolderId,
    },
    token,
  };
};
