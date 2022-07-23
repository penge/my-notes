import { MessageType } from "shared/storage/schema";

export default (type: MessageType, payload?: unknown): void => {
  chrome.runtime.sendMessage({ type, payload }).catch(() => {});
};
