import { initiate, sync, syncDeleteFile, stop } from "../google-drive/sync/index";
import { Message, MessageType } from "shared/storage/schema";

let syncInProgress = false;

export const registerGoogleDriveMessages = (): void => chrome.runtime.onMessage.addListener(async (message: Message) => {
  if (message.type === MessageType.SYNC_INITIATE) {
    const initiated = await initiate();
    if (initiated) {
      syncInProgress = true;
      await sync();
      syncInProgress = false;
    }
  }

  if (message.type === MessageType.SYNC && syncInProgress === false) {
    syncInProgress = true;
    await sync();
    syncInProgress = false;
  }

  if (message.type === MessageType.SYNC_DELETE_FILE && message.payload) {
    const fileId = message.payload as string;
    await syncDeleteFile(fileId);
  }

  if (message.type === MessageType.SYNC_STOP) {
    await stop();
  }
});

