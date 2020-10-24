import { MessageType } from "shared/storage/schema";

export const sendMessage = (type: MessageType, payload?: unknown): void => {
  chrome.runtime.sendMessage({ type, payload });
};
