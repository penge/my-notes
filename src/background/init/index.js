/* global chrome */

import randomId from "./random-id.js";

import migrations from "./migrations/index.js";
import contextMenu from "./context-menu.js";
import notifications from "./notifications.js";
import open from "./open.js";

import googleDrive from "./google-drive.js";

/**
 * Assigns a random ID to My Notes installation
 *
 * This ID is used by "Save selection to other devices"
 * to send a selection to other devices only
 */
const setId = () => {
  chrome.storage.local.get(["id"], local => {
    if (local.id) {
      return;
    }
    const id = randomId();
    chrome.storage.local.set({ id: id });
  });
};

export {
  setId,
  migrations,
  contextMenu,
  notifications,
  open,

  googleDrive,
};
