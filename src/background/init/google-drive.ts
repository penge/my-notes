import { initiate, sync, syncDeleteFile, stop } from "../google-drive/sync/index";
import { Message, MessageType } from "shared/storage/schema";

export const handleGoogleDriveMessage = (message: Message): void => {
  if (message.type === MessageType.SYNC_INITIATE) {
    initiate().then((initiated) => initiated && sync());
  }

  if (message.type === MessageType.SYNC) {
    sync();
  }

  if (message.type === MessageType.SYNC_DELETE_FILE && message.payload) {
    const fileId = message.payload as string;
    syncDeleteFile(fileId);
  }

  if (message.type === MessageType.SYNC_STOP) {
    stop();
  }
};

export const registerGoogleDriveMessages = (): void => {
  chrome.runtime.onMessage.addListener(handleGoogleDriveMessage);
};
