/* global chrome, document */

import contextMenu from "./context-menu.js";

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
    (isMac(os) && event.metaKey && (event.key === "S" || event.key === "s")) ||
    (!isMac(os) && event.ctrlKey && (event.key === "S" || event.key === "s"))
  ) {
    event.preventDefault();
    // Toggle Sidebar only if not in focus mode
    if (!state.focus) {
      const hasSidebar = document.body.classList.toggle("with-sidebar");
      chrome.storage.local.set({ sidebar: hasSidebar });
    }
    return;
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
