import { MessageType, Sync } from "shared/storage/schema";
import { sendMessage } from "messages/index";

export const syncNotes = (sync?: Sync): boolean => {
  // Cannot Sync if already in progress
  const canSync = sync && !document.body.classList.contains("syncing");
  if (!canSync) {
    return false;
  }

  document.body.classList.add("syncing");
  sendMessage(MessageType.SYNC);
  return true;
};
