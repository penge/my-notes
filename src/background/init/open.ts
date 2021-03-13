import { getItem, setItem } from "shared/storage/index";
import { havingPermission } from "shared/permissions/index";

// Open My Notes with 1 click on the My Notes icon in the browser's toolbar
const iconClick = () => chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "/notes.html" });
});

// It can be:
// - in Chrome as "chrome://newtab/"
// - in Edge as "edge://newtab/"
const NEW_TAB_PATH = "://newtab";

// Open My Notes in every New Tab if enabled in Options / "Open My Notes in every New Tab"
const newtab = () => chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (!tabId) {
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

  if (changeInfo.url?.includes(NEW_TAB_PATH)) {
    chrome.tabs.update(tabId, { url: "/notes.html" });
  }
});

export default {
  attach: (): void => {
    iconClick();
    newtab();
  }
};
