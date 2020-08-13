/* global chrome, window, document, Set, localStorage */

// Setting application state and view updates are done via a Proxy
import state from "./notes/state/index.js";

import { newNote, openOptions, content, syncNow } from "./notes/view/elements.js";
import typing from "./notes/typing.js";
import toolbar from "./notes/toolbar/index.js";
import { saveNotes, syncNotes } from "./notes/saving.js";
import hotkeys from "./notes/hotkeys.js";
import sidebar from "./notes/sidebar.js";
import { newNoteModal } from "./notes/modals.js";
import contextMenu from "./notes/context-menu.js";

import notesHistory from "./notes/history.js";

let tabId; // important so can update the content in other tabs (except the tab that has made the changes)
chrome.tabs.getCurrent((tab) => {
  // set as a "string" to quickly compare with localStorage.getItem("notesChangedBy")
  tabId = String(tab.id);

  // Typing, Toolbar, Hotkeys, Sidebar
  typing.initialize(content, tabId);
  toolbar.initialize(content, tabId);
  hotkeys.register(state);
  sidebar.register();
});

// Create a New note
newNote.addEventListener("click", () => {
  newNoteModal((name) => {
    state.createNote(name);
  });
});

// Open Options
openOptions.addEventListener("click", () => {
  chrome.tabs.create({ url: "/options.html" });
});

// Sync Now
syncNow.addEventListener("click", () => syncNotes(state));

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SYNC_STOP" || message.type === "SYNC_FAIL") {
    document.body.classList.remove("syncing");
  }
});

// Hide context menu on click outside
document.addEventListener("click", () => {
  contextMenu.hide();
});

chrome.storage.local.get([
  // Notifications
  "notification",

  // Appearance
  "font",
  "size",
  "sidebar",
  "sidebarWidth",
  "toolbar",
  "theme",
  "customTheme",

  // Notes
  "notes",
  "active",

  // Options
  "focus",
  "tab",

  // Sync
  "sync"
], local => {
  const {
    notification,
    font, size, sidebar, sidebarWidth, toolbar, theme, customTheme,
    notes, active : lastActive,
    focus, tab,
    sync } = local;

  // Notifications
  state.notification = notification; // shows a notification if any

  // Appearance
  state.font = font;
  state.size = size;
  state.sidebar = { show: sidebar, width: sidebarWidth };
  state.toolbar = { show: toolbar };
  state.theme = { name: theme, customTheme };

  // Notes
  state.notes = notes;
  const activeFromUrl = window.location.search.startsWith("?") && window.location.search.substring(1); // Bookmark
  const activeCandidate = activeFromUrl || lastActive || "Clipboard";
  state.active = (activeCandidate in notes) ? activeCandidate : null;
  if (state.active && !activeFromUrl) {
    notesHistory.replace(activeCandidate);
  }

  // Options
  state.focus = focus;
  state.tab = tab;

  // Sync
  state.sync = sync;
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    if (changes["font"]) {
      state.font = changes["font"].newValue;
    }

    if (changes["size"]) {
      state.size = changes["size"].newValue;
    }

    if (changes["theme"]) {
      const theme = changes["theme"].newValue;
      if (theme === "light" || theme === "dark") {
        state.theme = { name: theme };
      } else {
        chrome.storage.local.get(["customTheme"], local => {
          state.theme = { name: "custom", customTheme: local.customTheme };
        });
      }
    }

    if (changes["customTheme"]) {
      if (state.theme && state.theme.name === "custom") {
        state.theme = { name: "custom", customTheme: changes["customTheme"].newValue };
      }
    }

    if (changes["focus"]) {
      state.focus = changes["focus"].newValue;
    }

    if (changes["tab"]) {
      state.tab = changes["tab"].newValue;
    }

    if (changes["sync"]) {
      state.sync = changes["sync"].newValue;
      document.body.classList.remove("syncing");
    }

    if (changes["notes"]) {
      const oldNotes = changes["notes"].oldValue;
      const newNotes = changes["notes"].newValue;
      state.notes = newNotes;

      // Autoactivate the created note
      const newActive = changes["active"] && changes["active"].newValue;
      if (newActive && newActive in newNotes) {
        state.active = newActive;
        notesHistory.push(newActive);
        return;
      }

      // This should not happen (fallback)
      if (!state.active) {
        return;
      }

      // Reactivate edited note in other tabs only
      if (
        (state.active in oldNotes) &&
        (state.active in newNotes) &&
        (newNotes[state.active].content !== oldNotes[state.active].content) &&
        (localStorage.getItem("notesChangedBy") !== tabId)
      ) {
        const newActive = state.active;
        state.active = newActive;
        notesHistory.replace(newActive);
        return;
      }

      // Note is unchanged
      if (state.active in newNotes) {
        return;
      }

      // Activate "Clipboard" if some note was deleted
      const oldSet = new Set(Object.keys(oldNotes));
      const newSet = new Set(Object.keys(newNotes));
      if (oldSet.size > newSet.size) {
        state.active = "Clipboard";
        notesHistory.replace("Clipboard");
        return;
      }

      // Reactivate renamed note in other tabs only
      if (newSet.size === oldSet.size) {
        const diff = new Set([...newSet].filter(x => !oldSet.has(x)));
        if (diff.size === 1) {
          const newActive = diff.values().next().value;
          state.active = newActive;
          notesHistory.replace(newActive);
        }
      }
    }
  }

  if (areaName === "sync") {
    if (changes["selection"]) {
      const selection = changes["selection"].newValue;
      if (!selection) { return; }
      chrome.storage.local.get(["id"], local => {
        if (selection.sender === local.id) { return; }
        const notes = { ...state.notes };
        if ("Clipboard" in notes) {
          notes["Clipboard"].content = selection.text + notes["Clipboard"].content;
          chrome.storage.local.set({ notes: notes });
        }
      });
    }
  }
});

const openLink = (event) => {
  if (!document.body.classList.contains("with-command")) {
    return;
  }

  event.preventDefault();
  const href = event.target.tagName.toLowerCase() === "a" && event.target.href;
  href && window.open(href, "_blank");
};

content.addEventListener("click", openLink); // Chrome OS, Windows
content.addEventListener("contextmenu", openLink); // OSX would open Context menu when holding Ctrl

window.addEventListener("blur", () => {
  document.body.classList.remove("with-command");
});

// History
notesHistory.attach(state);

// Notes are saved every 1 second by "saveNotesDebounce()"
// When the window is closed sooner, save the notes immediately, if changed
window.addEventListener("beforeunload", () => {
  // Save the most recent version of notes (changes are gathered across Tabs)
  saveNotes(state.notes);
});
