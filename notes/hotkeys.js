/* global chrome, document */

import contextMenu from "./context-menu.js";

const getAndClick = id => {
  const elem = document.getElementById(id);
  elem && elem.click();
};

const isMac = (os) => os === "mac";

const registerOpenOptions = (event, { os }) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && (event.key === "O" || event.key === "o")) ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && (event.key === "O" || event.key === "o"))
  ) {
    event.preventDefault();
    chrome.tabs.create({ url: "/options.html" });
  }
};

const registerToggleFocusMode = (event, { os, state }) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && (event.key === "F" || event.key === "f")) ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && (event.key === "F" || event.key === "f"))
  ) {
    event.preventDefault();
    // Toggle Focus mode only when a note is open (active)
    if (state.active) {
      chrome.storage.local.get(["focus"], local => {
        chrome.storage.local.set({ focus: !local.focus });
      });
    }
  }
};

const registerToggleSidebar = (event, { os, state }) => {
  if (
    (isMac(os) && event.metaKey && (event.key === "S" || event.key === "s") && !event.shiftKey) ||
    (!isMac(os) && event.ctrlKey && (event.key === "S" || event.key === "s") && !event.shiftKey)
  ) {
    event.preventDefault();
    // Toggle Sidebar only if not in focus mode
    if (!state.focus) {
      const hasSidebar = document.body.classList.toggle("with-sidebar");
      chrome.storage.local.set({ sidebar: hasSidebar });
    }
  }
};

const registerToggleToolbar = (event, { os, state }) => {
  if (
    (isMac(os) && event.metaKey && (event.key === "E" || event.key === "e")) ||
    (!isMac(os) && event.ctrlKey && (event.key === "E" || event.key === "e"))
  ) {
    event.preventDefault();
    // oggle Toolbar only if not in focus mode
    if (!state.focus) {
      const hasToolbar = document.body.classList.toggle("with-toolbar");
      chrome.storage.local.set({ toolbar: hasToolbar });
    }
  }
};

const registerOpenNoteOnMouseHover = (event, { os, state }) => {
  if (
    (isMac(os) && event.metaKey) ||
    (!isMac(os) && event.ctrlKey)
  ) {
    document.body.classList.add("with-control");
    const hoveredNote = document.querySelector(".note.over");
    hoveredNote && state.activateNote(hoveredNote.innerText);
  }
};

const registerCloseContextMenu = (event) => {
  if (event.key === "Escape" || event.keyCode === 27) {
    contextMenu.hide();
  }
};

const registerCloseModal = (event) => {
  if (event.key === "Escape" || event.keyCode === 27) {
    const cancel = document.getElementById("cancel");
    cancel && cancel.click();
  }
};

const registerConfirmModal = (event) => {
  if (event.key === "Enter" || event.keyCode === 13) {
    // Look for #confirm in #modal
    const confirm = document.getElementById("confirm");
    if (confirm) {
      // if modal is open and therefore can be confirmed and closed with Enter,
      // prevent default behaviour of Enter
      event.preventDefault();
      confirm.click();
    }
  }
};

const registerIndentOnTab = (event, { state }) => {
  if (state.tab && event.key === "Tab") {
    event.preventDefault();
    document.execCommand("insertHTML", false, "&#009");
  }
};

const registerUnderline = (event, { os }) => {
  if (isMac(os) && event.metaKey && (event.key === "U" || event.key === "u")) {
    event.preventDefault();
    getAndClick("U");
  }
};

const registerStrikethrough = (event, { os }) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && (event.key === "X" || event.key === "x")) ||
    (!isMac(os) && event.altKey && event.shiftKey && event.key === "5")
  ) {
    event.preventDefault();
    getAndClick("S");
  }
};

const registerRemoveFormat = (event, { os }) => {
  if (
    (isMac(os) && event.metaKey && event.key === "\\") ||
    (!isMac(os) && event.ctrlKey && event.key === "\\")
  ) {
    event.preventDefault();
    getAndClick("RF");
  }
};

const registerBulletedList = (event, { os }) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.key === "7") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && event.key === "7")
  ) {
    event.preventDefault();
    getAndClick("UL");
  }
};

const registerNumberedList = (event, { os }) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.key === "8") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && event.key === "8")
  ) {
    event.preventDefault();
    getAndClick("OL");
  }
};

const registerSyncNotes = (event, { os }) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && (event.key === "S" || event.key === "s")) ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && (event.key === "S" || event.key === "s"))
  ) {
    event.preventDefault();
    getAndClick("sync-now");
  }
};

const keydown = (state, os) => document.addEventListener("keydown", (event) => {
  registerOpenOptions(event, { os });
  registerToggleFocusMode(event, { os, state });
  registerToggleSidebar(event, { os, state });
  registerToggleToolbar(event, { os, state });
  // navigateBackwardOneNote => see window.onpopstate in history.js
  // navigateForwardOneNote => see window.onpopstate in history.js
  registerOpenNoteOnMouseHover(event, { os, state });

  // Same for any OS
  registerCloseContextMenu(event);
  registerCloseModal(event);
  registerConfirmModal(event);
  registerIndentOnTab(event, { state });

  // Formatting
  registerUnderline(event, { os });
  registerStrikethrough(event, { os });
  registerRemoveFormat(event, { os });

  // Lists
  registerBulletedList(event, { os });
  registerNumberedList(event, { os });

  // Sync notes
  registerSyncNotes(event, { os });
});

const keyup = () => document.addEventListener("keyup", () => {
  document.body.classList.remove("with-control");
});

const register = (state) => {
  chrome.runtime.getPlatformInfo((platformInfo) => {
    const os = platformInfo.os;
    keydown(state, os);
  });
  keyup();
};

export default { register };
