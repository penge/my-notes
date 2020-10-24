/* global chrome */

// Shows a notification when a new version of My Notes is installed
const newVersion = () => chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== "update") {
    return;
  }

  const notification = {
    type: "NEW_VERSION",
    version: chrome.runtime.getManifest().version,
  };

  chrome.storage.local.set({ notification: notification });
});

export default {
  attach: () => {
    newVersion();
  }
};
