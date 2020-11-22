import { initiate, sync, syncDeleteFile, stop } from "../google-drive/sync/index";
import { Message, MessageType } from "shared/storage/schema";

let syncLock = false;

const attach = (): void => chrome.runtime.onMessage.addListener(async (message: Message) => {
  if (message.type === MessageType.SYNC_INITIATE) {
    const initiated = await initiate();
    if (initiated) {
      syncLock = true;
      await sync();
      syncLock = false;
    }
  }

  if (message.type === MessageType.SYNC && syncLock === false) {
    syncLock = true;
    await sync();
    syncLock = false;
  }

  if (message.type === MessageType.SYNC_DELETE_FILE && message.payload) {
    const fileId = message.payload as string;
    await syncDeleteFile(fileId);
  }

  if (message.type === MessageType.SYNC_STOP) {
    await stop();
  }
});

export default {
  attach,
};
