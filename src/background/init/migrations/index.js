/* global chrome */

import migrate from "./core.js";

const run = () => {
  chrome.storage.sync.get(["newtab", "value", "notes"], sync => {
    chrome.storage.local.get(["font", "size", "theme", "customTheme", "notes", "active", "focus", "newtab", "tab"], local => {
      const items = migrate(sync, local); // migrate notes and options
      chrome.storage.local.set(items); // store the migrated data

      chrome.storage.sync.remove(["newtab", "value", "notes"]); // no longer needed
    });
  });
};

export default {
  run,
};
