import { State } from "./state/index";

import contextMenu from "./context-menu";

const getAndClick = (id: string) => {
  const elem = document.getElementById(id);
  elem && elem.click();
};

const isMac = (os: string) => os === "mac";

interface Options {
  os: string
  state: State
}

const registerOpenOptions = (event: KeyboardEvent, { os }: Options) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && (event.key === "O" || event.key === "o")) ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && (event.key === "O" || event.key === "o"))
  ) {
    event.preventDefault();
    chrome.tabs.create({ url: "/options.html" });
  }
};

const registerToggleFocusMode = (event: KeyboardEvent, { os, state }: Options) => {
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

const registerToggleSidebar = (event: KeyboardEvent, { os, state }: Options) => {
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

const registerToggleToolbar = (event: KeyboardEvent, { os, state }: Options) => {
  if (
    (isMac(os) && event.metaKey && (event.key === "E" || event.key === "e")) ||
    (!isMac(os) && event.ctrlKey && (event.key === "E" || event.key === "e"))
  ) {
    event.preventDefault();
    // Toggle Toolbar only if not in focus mode
    if (!state.focus) {
      const hasToolbar = document.body.classList.toggle("with-toolbar");
      chrome.storage.local.set({ toolbar: hasToolbar });
    }
  }
};

const registerOpenNoteOnMouseHover = (event: KeyboardEvent, { os, state }: Options) => {
  if (
    (isMac(os) && event.metaKey) ||
    (!isMac(os) && event.ctrlKey)
  ) {
    document.body.classList.add("with-control");
    const hoveredNote = document.querySelector(".note.over");
    hoveredNote && state.activateNote((hoveredNote as HTMLElement).innerText);
  }
};

const registerCloseContextMenu = (event: KeyboardEvent) => {
  if (event.key === "Escape" || event.keyCode === 27) {
    contextMenu.hide();
  }
};

const registerCloseModal = (event: KeyboardEvent) => {
  if (event.key === "Escape" || event.keyCode === 27) {
    const cancel = document.getElementById("cancel");
    cancel && cancel.click();
  }
};

const registerConfirmModal = (event: KeyboardEvent) => {
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

const registerIndentOnTab = (event: KeyboardEvent, { state }: Options) => {
  if (state.tab && event.key === "Tab") {
    event.preventDefault();
    document.execCommand("insertHTML", false, "&#009");
  }
};

const registerUnderline = (event: KeyboardEvent, { os }: Options) => {
  if (isMac(os) && event.metaKey && (event.key === "U" || event.key === "u")) {
    event.preventDefault();
    getAndClick("U");
  }
};

const registerStrikethrough = (event: KeyboardEvent, { os }: Options) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && (event.key === "X" || event.key === "x")) ||
    (!isMac(os) && event.altKey && event.shiftKey && (event.key === "5" || event.keyCode === 53 || event.code === "Digit5"))
  ) {
    event.preventDefault();
    getAndClick("S");
  }
};

const registerRemoveFormat = (event: KeyboardEvent, { os }: Options) => {
  if (
    (isMac(os) && event.metaKey && event.key === "\\") ||
    (!isMac(os) && event.ctrlKey && event.key === "\\")
  ) {
    event.preventDefault();
    getAndClick("RF");
  }
};

const registerBulletedList = (event: KeyboardEvent, { os }: Options) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && (event.key === "7" || event.keyCode === 55 || event.code === "Digit7")) ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && (event.key === "7" || event.keyCode === 55 || event.code === "Digit7"))
  ) {
    event.preventDefault();
    getAndClick("UL");
  }
};

const registerNumberedList = (event: KeyboardEvent, { os }: Options) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && (event.key === "8" || event.keyCode === 56 || event.code === "Digit8")) ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && (event.key === "8" || event.keyCode === 56 || event.code === "Digit8"))
  ) {
    event.preventDefault();
    getAndClick("OL");
  }
};

const registerSyncNotes = (event: KeyboardEvent, { os }: Options) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && (event.key === "S" || event.key === "s")) ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && (event.key === "S" || event.key === "s"))
  ) {
    event.preventDefault();
    getAndClick("sync-now");
  }
};

const keydown = (options: Options) => document.addEventListener("keydown", (event) => {
  registerOpenOptions(event, options);
  registerToggleFocusMode(event, options);
  registerToggleSidebar(event, options);
  registerToggleToolbar(event, options);
  // navigateBackwardOneNote => see window.onpopstate in history.js
  // navigateForwardOneNote => see window.onpopstate in history.js
  registerOpenNoteOnMouseHover(event, options);

  // Same for any OS
  registerCloseContextMenu(event);
  registerCloseModal(event);
  registerConfirmModal(event);
  registerIndentOnTab(event, options);

  // Formatting
  registerUnderline(event, options);
  registerStrikethrough(event, options);
  registerRemoveFormat(event, options);

  // Lists
  registerBulletedList(event, options);
  registerNumberedList(event, options);

  // Sync notes
  registerSyncNotes(event, options);
});

const keyup = () => document.addEventListener("keyup", () => {
  document.body.classList.remove("with-control");
});

const register = (state: State): void => {
  chrome.runtime.getPlatformInfo((platformInfo) => {
    const os = platformInfo.os;
    const options = { os, state } as Options;
    keydown(options);
  });

  keyup();
};

export default { register };
