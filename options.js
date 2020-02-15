/* global chrome */

import { renderCommonFonts } from "./options/render.js";
renderCommonFonts();

import { attachEvents } from "./options/events.js";
attachEvents();

/* State  */

import {
  setFont,
  setSize,
  setTheme,
  setFocus,
  setNewtab,
  setSync,

  setChange,
  setVersion,
} from "./options/state.js";

chrome.storage.local.get(["font", "size", "theme", "focus", "newtab", "sync"], local => {
  const { font, size, theme, focus, newtab, sync } = local;
  setFont(font);
  setSize(size);
  setTheme(theme);
  setFocus(focus);
  setNewtab(newtab);
  setSync(sync);
});

// Apply the changes in other Options pages to keep them in sync
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    setChange(changes["font"], setFont);
    setChange(changes["size"], setSize);
    setChange(changes["theme"], setTheme);
    setChange(changes["focus"], setFocus);
    setChange(changes["newtab"], setNewtab);
    setChange(changes["sync"], setSync);
  }
});

const version = chrome.runtime.getManifest().version;
setVersion(version);
