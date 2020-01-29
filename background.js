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

const defaultSize = 150;
const defaultMode = "light"; // "light", "dark"
const defaultFocus = false;

chrome.runtime.onInstalled.addListener(function () {
  // Try to load notes from prior versions (order matters)
  chrome.storage.sync.get(["newtab", "value", "notes"], sync => {
    // sync.value:string => 1.4, 1.3, 1.2
    // sync.newtab:string => 1.1.1, 1.1, 1.0
    // sync.notes:array => 2.0, 2.0.1, 2.0.2, 2.1
    // local.notes:array => >= 2.2

    chrome.storage.local.get(["notes"], local => {
      let notes = sync.value || sync.newtab || sync.notes || local.notes || defaultNotes;

      // < 2.x
      if (typeof notes === "string") {
        notes = [notes, "", ""];
      }

      chrome.storage.sync.remove(["newtab", "value", "notes"]);
      chrome.storage.local.set({ notes: notes });
    });
  });

  chrome.storage.local.get(["index", "font", "size", "mode", "focus"], local => {
    chrome.storage.local.set({
      index: (local.index || defaultIndex),
      font: (local.font || defaultFont),
      size: (local.size || defaultSize),
      mode: (local.mode || defaultMode),
      focus: (local.focus || defaultFocus),
    });
  });
});
