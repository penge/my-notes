import randomId from "./random-id";

import migrations from "./migrations/index";
import contextMenu from "./context-menu";
import notifications from "./notifications";
import open from "./open";

import googleDrive from "./google-drive";

/**
 * Assigns a random ID to My Notes installation
 *
 * This ID is used by "Save selection to other devices"
 * to send a selection to other devices only
 */
const setId = (): void => {
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
