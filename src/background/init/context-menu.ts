import { Message, MessageType } from "shared/storage/schema";

import {
  saveToClipboard,
  saveToClipboardInOtherDevices,
} from "./clipboard";

const ID = "my-notes";

/**
 * Creates My Notes Context menu
 *
 * To use the Context menu, select a text on
 * a website and follow with a right-click
 *
 * Required permission: "contextMenus" (see manifest.json)
 */
const create = (): void => {
  chrome.contextMenus.create({
    id: ID,
    title: "My Notes",
    contexts: ["selection"],
  }, () => {
    chrome.contextMenus.create({
      parentId: ID,
      id: "my-notes-save",
      title: "Save selected text to Clipboard",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      parentId: ID,
      id: "my-notes-save-other",
      title: "Save selected text to Clipboard in other devices",
      contexts: ["selection"],
    });
  });
};

const attach = (): void => chrome.contextMenus.onClicked.addListener((info) => {
  const { pageUrl, selectionText } = info;
  const pageUrlLink = pageUrl.startsWith("http") ? `<a href="${pageUrl}" target="_blank">${pageUrl}</a>` : pageUrl;
  const textToSave = `${selectionText}<br><b>(${pageUrlLink})</b><br><br>`;

  if (info.menuItemId === "my-notes-save") {
    saveToClipboard(textToSave);
  }

  if (info.menuItemId === "my-notes-save-other") {
    saveToClipboardInOtherDevices(textToSave);
  }

  chrome.runtime.onMessage.addListener((message: Message) => {
    if (message.type === MessageType.SAVE_TO_CLIPBOARD && message.payload) {
      saveToClipboard(message.payload as string);
    }
  });
});

export default {
  create,
  attach,
};
