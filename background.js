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

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({
    notes: defaultNotes
  });

  chrome.storage.local.set({
    index: defaultIndex,
    font: defaultFont,
    size: defaultSize,
    mode: defaultMode
  });
});
