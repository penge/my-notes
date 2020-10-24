import { Notification, NotificationType } from "shared/storage/schema";

// Shows a notification when a new version of My Notes is installed
const newVersion = () => chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== "update") {
    return;
  }

  const notification: Notification = {
    type: NotificationType.NEW_VERSION,
    payload: chrome.runtime.getManifest().version,
  };

  chrome.storage.local.set({ notification: notification });
});

export default {
  attach: (): void => {
    newVersion();
  }
};
