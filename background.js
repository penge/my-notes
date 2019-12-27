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

chrome.runtime.onInstalled.addListener(function () {
  // Try to load notes from prior versions (order matters)
  chrome.storage.sync.get(["newtab", "value", "notes"], sync => {
    // sync.value:string => 1.4, 1.3, 1.2
    // sync.newtab:string => 1.1.1, 1.1, 1.0
    // sync.notes:array => 2.x
    let notes = sync.value || sync.newtab || sync.notes || defaultNotes;

    // < 2.x
    if (typeof notes === "string") {
      notes = [notes, "", ""];
    }

    chrome.storage.sync.remove(["newtab", "value"]);
    chrome.storage.sync.set({ notes: notes });
  });

  chrome.storage.local.get(["index", "font", "size", "mode"], local => {
    chrome.storage.local.set({
      index: (local.index || defaultIndex),
      font: (local.font || defaultFont),
      size: (local.size || defaultSize),
      mode: (local.mode || defaultMode)
    });
  });
});
