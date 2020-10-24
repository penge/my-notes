/* global chrome */

const ID = "my-notes";

/**
 * Creates My Notes Context menu
 *
 * To use the Context menu, select a text on
 * a website and follow with a right-click
 *
 * Required permission: "contextMenus" (see manifest.json)
 */
const create = () => {
  chrome.contextMenus.create({
    id: ID,
    title: "My Notes",
    contexts: ["selection"],
  }, () => {
    chrome.contextMenus.create({
      parentId: ID,
      id: "my-notes-save",
      title: "Save selection",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      parentId: ID,
      id: "my-notes-send",
      title: "Save selection to other devices",
      contexts: ["selection"],
    });
  });
};

const attach = () => chrome.contextMenus.onClicked.addListener((info) => {
  const { pageUrl, selectionText } = info;
  const textToSave = `${selectionText}<br><b>${pageUrl}</b><br><br>`;

  if (info.menuItemId === "my-notes-save") {
    chrome.storage.local.get(["notes"], local => {
      const notes = local.notes;
      // Selection can be send only if "Clipboard" note exists
      if ("Clipboard" in notes) {
        notes["Clipboard"].content = textToSave + notes["Clipboard"].content;
        chrome.storage.local.set({ notes: notes });
      }
    });
  }

  if (info.menuItemId === "my-notes-send") {
    chrome.storage.local.get(["id"], local => {
      if (!local.id) {
        return;
      }
      const selection = {
        text: textToSave,
        sender: local.id,
      };
      chrome.storage.sync.set({ selection: selection });
    });
  }
});

export default {
  create,
  attach,
};
