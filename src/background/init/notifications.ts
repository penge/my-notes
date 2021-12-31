import { Notification, NotificationType } from "shared/storage/schema";

// Shows a notification when a new version of My Notes is installed
export const showNewVersionNotification = (details: chrome.runtime.InstalledDetails): void => {
  if (details.reason !== "update") {
    return;
  }

  const notification: Notification = {
    type: NotificationType.NEW_VERSION,
    payload: chrome.runtime.getManifest().version,
  };

  chrome.storage.local.set({ notification });
};

// Shows a Chrome notification in the top-right corner
export const notify = (message: string) => chrome.notifications.create({
  type: "basic",
  title: "My Notes",
  message,
  iconUrl: "images/icon128.png",
});
