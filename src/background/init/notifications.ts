import { Notification, NotificationType } from "shared/storage/schema";
import splitId from "./context-menu/split-id";

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
export const notify = ({
  notificationId,
  message,
}: {
  notificationId: string,
  message: string,
}) => chrome.notifications.create(notificationId, {
  type: "basic",
  title: "My Notes",
  message,
  iconUrl: "images/icon128.png",
});

export const attachNotificationsOnClicked = () => {
  chrome.notifications.onClicked.addListener((notificationId) => {
    const { context, noteName } = splitId<string, string>(notificationId);
    if (context === "note" && noteName) {
      chrome.storage.local.get(["notes"], (local) => {
        if (noteName in local.notes) {
          chrome.tabs.create({
            url: `notes.html?note=${noteName}`,
          });
        }
      });
    }
  });
};
