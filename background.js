"use strict";

/* global chrome */

const defaultNotes = ["", "", ""];
const defaultIndex = 0;

const defaultFont = {
  id: "courier-new",
  name: "Courier New",
  genericFamily: "monospace",
  fontFamily: "Courier New,monospace" // fallback is always the generic
};

const defaultSize = 200;
const defaultMode = "light"; // "light", "dark"

const setNotes = (notes) => {
  chrome.storage.sync.set({
    notes: notes
  });
};

chrome.runtime.onInstalled.addListener(function () {
  // Try to load notes from prior versions (order matters)
  chrome.storage.sync.get(["newtab", "value", "notes"], sync => {
    // 1.4, 1.3, 1.2
    if (sync.value) {
      setNotes([sync.value, "", ""]);
      chrome.storage.sync.remove(["value", "newtab"]);

    // 1.1.1, 1.1, 1.0
    } else if (sync.newtab) {
      setNotes([sync.newtab, "", ""]);
      chrome.storage.sync.remove(["newtab"]);

    // 2.x
    } else if (sync.notes) {
      setNotes(sync.notes);

    // No prior version installed
    } else {
      setNotes(defaultNotes);
    }
  });

  chrome.storage.local.set({
    index: defaultIndex,
    font: defaultFont,
    size: defaultSize,
    mode: defaultMode
  });
});
