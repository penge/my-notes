import { uploadFileBody } from "background/google-drive/bodies";
import * as api from "background/google-drive/api";
import { Sync } from "shared/storage/schema";
import { setItem } from "shared/storage";
import { Log } from "shared/logger";
import stop from "background/google-drive/sync/stop";

interface Image {
  name: string
  type: string
  data: string
  width: number
  height: number
}

interface UploadImageProps {
  sync: Sync
  token: string
  image: Image
  onProgress: (progress: number) => void
  onUploaded: (src: string, width: number, height: number) => void
  onError: () => void
}

const uploadImageCore = async (run: number, { sync, token, image, onProgress, onUploaded, onError }: UploadImageProps): Promise<void> => {
  if (run > 2) {
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart");
  xhr.setRequestHeader("Authorization", `Bearer ${token}`);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "multipart/related; boundary=my-notes");

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percentComplete = event.loaded / event.total * 100;
      onProgress(percentComplete);
    }
  };

  xhr.onload = async () => {
    const json = JSON.parse(xhr.response);
    if (!json) {
      return;
    }

    const errorMessage: string | undefined = json.error && json.error.message;
    if (errorMessage === `File not found: ${sync.assetsFolderId}.`) {
      Log("IMAGE UPLOAD - PROBLEM - \"assets\" folder does not exist (will try to create it)");

      const newAssetsFolderId = await api.getAssetsFolderId(sync.folderId) || await api.createAssetsFolder(sync.folderId);
      if (!newAssetsFolderId) {
        Log("IMAGE UPLOAD - PROBLEM - \"My Notes\" folder does not exist (will stop sync)");
        await stop();
        onError();
        return;
      }

      const updatedSync = {
        ...sync,
        assetsFolderId: newAssetsFolderId,
      };

      await setItem("sync", {
        ...sync,
        assetsFolderId: newAssetsFolderId,
      });

      uploadImageCore(run + 1, { sync: updatedSync, token, image, onProgress, onUploaded, onError });
      return;
    }

    const imageId: string = json.id;
    if (imageId) {
      const src = `https://drive.google.com/uc?id=${imageId}`;
      onUploaded(src, image.width, image.height);
    }
  };

  const time = new Date().toISOString();

  const body = uploadFileBody(sync.assetsFolderId, {
    name: image.name,
    type: image.type,
    content: image.data,
    createdTime: time,
    modifiedTime: time,
  });

  xhr.send(body);
};

export const uploadImage = (props: UploadImageProps): void => {
  uploadImageCore(1, props);
};
