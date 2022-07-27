import getAuthToken from "shared/identity/get-auth-token";
import { setItem } from "shared/storage";
import { Sync } from "shared/storage/schema";
import runCommonPreconditions from "./run-common-preconditions";
import * as api from "../api";

interface UploadPreconditionsResult {
  sync: Sync
  token: string
}

export default async (): Promise<UploadPreconditionsResult | undefined> => {
  const sync = await runCommonPreconditions("UPLOAD");
  if (!sync) {
    return undefined;
  }

  // Get existing "assets" folder ID, or create "assets" folder if not found
  const assetsFolderId = sync.assetsFolderId || await api.getAssetsFolderId(sync.folderId) || await api.createAssetsFolder(sync.folderId);
  if (sync.assetsFolderId !== assetsFolderId) {
    await setItem("sync", {
      ...sync,
      assetsFolderId,
    });
  }

  const token = await getAuthToken();
  if (!token) {
    return undefined;
  }

  return {
    sync: {
      ...sync,
      assetsFolderId,
    },
    token,
  };
};
