/* global chrome, document */

import contextMenu from "./context-menu.js";

const toggleFocus = () => {
  chrome.storage.local.get(["focus"], local => {
    chrome.storage.local.set({ focus: !local.focus });
  });
};

const keydown = (state) => document.addEventListener("keydown", (event) => {
  if (event.ctrlKey) {
    document.body.classList.add("with-command");
    const hoveredNote = document.querySelector(".note.over");
    hoveredNote && state.activateNote(hoveredNote.innerText);
  }

  if (event.key === "Escape" || event.keyCode === 27) {
    event.preventDefault();

    // Hide context menu
    contextMenu.hide();

    // Close #modal
    const cancel = document.getElementById("cancel");
    cancel && cancel.click();

    return;
  }

  if (event.key === "Enter" || event.keyCode === 13) {
    // Look for #confirm in #modal
    const confirm = document.getElementById("confirm");
    if (confirm) {
      // if modal is open and thefore can be confirmed and closed with Enter,
      // prevent default behaviour of Enter
      event.preventDefault();
      confirm.click();
    }
  }

  if ((event.metaKey || event.ctrlKey) && (event.key === "S" || event.key === "s")) {
    event.preventDefault();
    if (state.focus !== true) {
      const hasSidebar = document.body.classList.toggle("with-sidebar");
      chrome.storage.local.set({ sidebar: hasSidebar });
    }
    return;
  }

  if ((event.metaKey || event.ctrlKey) && (event.key === "E" || event.key === "e")) {
    event.preventDefault();
    if (state.focus !== true) {
      const hasToolbar = document.body.classList.toggle("with-toolbar");
      chrome.storage.local.set({ toolbar: hasToolbar });
    }
    return;
  }

  if (state.tab && event.key === "Tab") {
    event.preventDefault();
    document.execCommand("insertHTML", false, "&#009");
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.shiftKey && (event.key === "F" || event.key === "f")) {
    event.preventDefault();
    state.active && toggleFocus(); // toggle focus only when a note is open
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.shiftKey && (event.key === "O" || event.key === "o")) {
    event.preventDefault();
    chrome.tabs.create({ url: "/options.html" });
    return;
  }
});

const keyup = () => document.addEventListener("keyup", () => {
  document.body.classList.remove("with-command");
});

const register = (state) => {
  keydown(state);
  keyup();
};

export default { register };
