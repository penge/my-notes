import { renderCommonFonts } from "./options/render";
renderCommonFonts();

import { attachEvents } from "./options/events";
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
} from "./options/state";
import { Theme } from "shared/storage/schema";

chrome.storage.local.get(["font", "size", "theme", "customTheme", "newtab", "tab", "sync"], local => {
  const { font, size, theme, customTheme, newtab, tab, sync } = local;
  setFont(font);
  setSize(size);
  setTheme({ name: theme, customTheme });
  setNewtab(newtab);
  setTab(tab);
  setSync(sync);
});

// Apply the changes in other Options pages to keep them in sync
chrome.storage.onChanged.addListener((changes: { [key: string]: chrome.storage.StorageChange; }, areaName: "sync" | "local" | "managed") => {
  if (areaName === "local") {
    setChange(changes["font"], setFont);
    setChange(changes["size"], setSize);
    setChange(changes["theme"], (theme: Theme) => {
      if (theme === "light" || theme === "dark") {
        setTheme({ name: theme });
      } else {
        chrome.storage.local.get(["customTheme"], local => {
          setTheme({ name: "custom", customTheme: local.customTheme });
        });
      }
    });
    setChange(changes["customTheme"], (customTheme: string) => {
      if (document.body.id === "custom") {
        setTheme({ name: "custom", customTheme });
      }
    });
    setChange(changes["newtab"], setNewtab);
    setChange(changes["tab"], setTab);
    setChange(changes["sync"], setSync);
  }
});

chrome.runtime.getPlatformInfo((platformInfo) => {
  const os = platformInfo.os === "mac" ? "mac" : "other";
  document.body.classList.add(`os-${os}`);
});

const version = chrome.runtime.getManifest().version;
setVersion(version);
