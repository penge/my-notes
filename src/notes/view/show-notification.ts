import { Notification, NotificationType } from "shared/storage/schema";

import {
  newVersionNotificationTemplate
} from "./elements";

const attachClose = (notificationElem: HTMLElement) => {
  const close = notificationElem.getElementsByClassName("close")[0];
  close.addEventListener("click", (event) => {
    event.preventDefault();
    chrome.storage.local.remove("notification", () => {
      document.querySelectorAll(".notification").forEach(el => el.remove());
    });
  });
};

const show = (notificationElem: HTMLElement) => {
  document.body.prepend(notificationElem);
};

export default function showNotification(notification: Notification): void {
  if (!notification) {
    return;
  }

  if (notification.type === NotificationType.NEW_VERSION) {
    const node = newVersionNotificationTemplate.content.cloneNode(true) as HTMLElement;
    const notificationElem = node.children[0] as HTMLElement;

    const version = notificationElem.getElementsByClassName("version")[0] as HTMLElement;
    version.innerText = notification.payload;

    attachClose(notificationElem);
    show(notificationElem);
  }
}
