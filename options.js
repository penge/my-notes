/* global document, chrome */

import { renderCommonFonts } from "./options/render.js";
renderCommonFonts();

import { attachEvents } from "./options/events.js";
attachEvents();

/* State  */

import {
  setFont,
  setSize,
  setTheme,
  setNewtab,
  setTab,
  setSync,

  setChange,
  setVersion,
} from "./options/state.js";

chrome.storage.local.get(["font", "size", "theme", "customTheme", "newtab", "tab", "sync"], local => {
  const { font, size, theme, customTheme, newtab, tab, sync } = local;
  setFont(font);
  setSize(size);
  setTheme(theme, customTheme);
  setNewtab(newtab);
  setTab(tab);
  setSync(sync);
});

// Apply the changes in other Options pages to keep them in sync
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    setChange(changes["font"], setFont);
    setChange(changes["size"], setSize);
    setChange(changes["theme"], (theme) => {
      if (theme === "light" || theme === "dark") {
        setTheme(theme);
      } else {
        chrome.storage.local.get(["customTheme"], local => {
          setTheme("custom", local.customTheme);
        });
      }
    });
    setChange(changes["customTheme"], (customTheme) => {
      if (document.body.id === "custom") {
        setTheme("custom", customTheme);
      }
    });
    setChange(changes["newtab"], setNewtab);
    setChange(changes["tab"], setTab);
    setChange(changes["sync"], setSync);
  }
});

const version = chrome.runtime.getManifest().version;
setVersion(version);
