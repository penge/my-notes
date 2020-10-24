import { getItem, setItem } from "shared/storage/index";
import { havingPermission } from "shared/permissions/index";

// Open My Notes with 1 click on the My Notes icon in the browser's toolbar
const iconClick = () => chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: "/notes.html" });
});

// It can be:
// - in Chrome as "chrome://newtab/"
// - in Edge as "edge://newtab/"
const NEW_TAB_PATH = "://newtab";

// Open My Notes in every New Tab if enabled in Options / "Open My Notes in every New Tab"
const newtab = () => chrome.tabs.onCreated.addListener(async (tab) => {
  if (!tab.id) {
    return;
  }

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
  if (tab.pendingUrl?.includes(NEW_TAB_PATH) || tab.url?.includes(NEW_TAB_PATH)) {
    chrome.tabs.update(tab.id, { url: "/notes.html" });
  }
});

export default {
  attach: (): void => {
    iconClick();
    newtab();
  }
};
