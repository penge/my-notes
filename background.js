"use strict";

/* global chrome */

const defaultFont = {
  id: "courier-new",
  name: "Courier New",
  genericFamily: "monospace",
  fontFamily: "Courier New,monospace" // fallback is always the generic
};

const defaultMode = "light"; // "light", "dark"

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({
    // Font is set upon installation of the plugin.
    // The reason: You may visit My Notes, or My Notes Options page
    // in unspecified order. At that point, the font must be set.
    font: defaultFont,
    mode: defaultMode
  });
});
