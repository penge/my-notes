"use strict";

/* global chrome */

const defaultNotes = ["", "", ""];
const defaultIndex = 0;

const defaultFont = {
  id: "courier-new",
  name: "Courier New",
  genericFamily: "monospace",
  fontFamily: '"Courier New",monospace',
};

const defaultSize = 150;
const defaultMode = "light"; // "light", "dark"
const defaultFocus = false;
const defaultOverride = true;

const getRandomToken = () => {
  const randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);
  let hex = "";
  for (let i = 0; i < randomPool.length; i += 1) {
    hex += randomPool[i].toString(16);
  }
  return hex;
};

const createContextMenu = () => {
  chrome.contextMenus.create({
    id: "my-notes",
    title: "My Notes",
    contexts: ["selection"],
  }, () => {
    chrome.contextMenus.create({
      parentId: "my-notes",
      id: "my-notes-save",
      title: "Save selection",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      parentId: "my-notes",
      id: "my-notes-send",
      title: "Save selection to other devices",
      contexts: ["selection"],
    });
  });
};

chrome.runtime.onInstalled.addListener(() => {
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

  chrome.storage.local.get(["index", "font", "size", "mode", "focus", "override"], local => {
    chrome.storage.local.set({
      index: (local.index || defaultIndex),
      font: (local.font || defaultFont),
      size: (local.size || defaultSize),
      mode: (local.mode || defaultMode),
      focus: (local.focus || defaultFocus),
      override: (local.override || defaultOverride),
    });
  });

  const token = getRandomToken();
  chrome.storage.local.set({ token: token });

  createContextMenu();
});

chrome.contextMenus.onClicked.addListener((info) => {
  const { pageUrl, selectionText } = info;
  const textToSave = `// ${pageUrl}\r\n${selectionText}\r\n\r\n`;

  if (info.menuItemId === "my-notes-save") {
    chrome.storage.local.get(["notes"], local => {
      const notes = local.notes;
      notes[0] = textToSave + notes[0];
      chrome.storage.local.set({ notes: notes });
    });
  }

  if (info.menuItemId === "my-notes-send") {
    chrome.storage.local.get(["token"], local => {
      const selection = {
        text: textToSave,
        sender: local.token,
      };
      chrome.storage.sync.set({ selection: selection });
    });
  }
});

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: "/notes.html" });
});

chrome.tabs.onCreated.addListener((tab) => {
  chrome.storage.local.get(["override"], local => {
    if (!local.override) {
      return;
    }
    // pendingUrl available since Chrome 79; use url as fallback
    if (tab.pendingUrl === "chrome://newtab/" || tab.url === "chrome://newtab/") {
      chrome.tabs.update(tab.id, { url: "/notes.html" });
    }
  });
});
