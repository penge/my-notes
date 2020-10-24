/* global chrome */

import { syncNow } from "./elements.js";
import formatDate from "../../shared/date/format-date.js";

const tooltips = {
  mac: "Click to sync the notes to and from Google Drive now (⌘ + Shift + S).",
  other: "Click to sync the notes to and from Google Drive now (Ctrl + Shift + S)."
};

export default function setSync(sync) {
  if (typeof sync !== "object" || !sync.lastSync) {
    syncNow.classList.add("disabled");
    syncNow.title = "Google Drive Sync is disabled (see Options).";
    return;
  }

  const date = formatDate(sync.lastSync);
  chrome.runtime.getPlatformInfo((platformInfo) => {
    const os = platformInfo.os === "mac" ? "mac" : "other";
    syncNow.title = tooltips[os] + "\n\n" + "Last sync: " + date;
  });

  syncNow.classList.remove("disabled");
}
