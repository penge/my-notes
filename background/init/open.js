/* global chrome */

import { getItem, setItem } from "../../shared/storage/index.js";
import { havingPermission } from "../../shared/permissions/index.js";

// Open My Notes with 1 click on the My Notes icon in the browser's toolbar
const iconClick = () => chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: "/notes.html" });
});

// Open My Notes in every new tab if enabled in Options -> "Open My Notes in every new tab"
const newtab = () => chrome.tabs.onCreated.addListener(async (tab) => {
  const newtab = await getItem("newtab");
  if (!newtab) {
    return;
  }

  const allowed = await havingPermission("tabs");
  if (!allowed) {
    await setItem("newtab", false); // reset "newtab" because not having "tabs" permission
    return;
  }

  // pendingUrl is available since Chrome 79; url is a fallback
  if (tab.pendingUrl === "chrome://newtab/" || tab.url === "chrome://newtab/") {
    chrome.tabs.update(tab.id, { url: "/notes.html" });
  }
});

export default {
  attach: () => {
    iconClick();
    newtab();
  }
};
