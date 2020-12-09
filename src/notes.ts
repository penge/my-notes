// Setting application state and view updates are done via a Proxy
import state from "./notes/state/index";

import { newNote, openOptions, content, syncNow } from "./notes/view/elements";
import typing from "./notes/typing";
import toolbar from "./notes/toolbar/index";
import { saveNotes, syncNotes } from "./notes/saving";
import hotkeys from "./notes/hotkeys";
import sidebar from "./notes/sidebar";
import { newNoteModal } from "./notes/modals";
import contextMenu from "./notes/context-menu";

import notesHistory from "./notes/history";
import { Message, MessageType, ContextMenuSelection, NotesObject } from "shared/storage/schema";
import { sendMessage } from "messages/index";

let tabId: string; // important so can update the content in other tabs (except the tab that has made the changes)
chrome.tabs.getCurrent((tab) => {
  if (!tab) {
    return;
  }

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
  newNoteModal((newNoteName) => {
    state.createNote(newNoteName);
  });
});

// Open Options
openOptions.addEventListener("click", () => {
  chrome.tabs.create({ url: "/options.html" });
});

// Sync Now
syncNow.addEventListener("click", () => syncNotes(state));

chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type === MessageType.SYNC_DONE || message.type === MessageType.SYNC_FAIL) {
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
  "clipboard",

  // Options
  "focus",
  "tab",

  // Sync
  "sync"
], local => {
  const {
    notification,
    font, size, sidebar, sidebarWidth, toolbar, theme, customTheme,
    notes, active : lastActive, clipboard,
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
  const activeFromUrl = window.location.search.startsWith("?") && decodeURIComponent(window.location.search.substring(1)); // Bookmark
  const activeCandidates = [activeFromUrl, lastActive, Object.keys(notes).sort()[0]]; // ordered by importance
  state.active = activeCandidates.find((candidate) => candidate && candidate in notes) || null;
  if (state.active !== activeFromUrl) {
    notesHistory.replace(state.active || "");
  }
  state.clipboard = clipboard;

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
      const oldNotes: NotesObject = changes["notes"].oldValue;
      const newNotes: NotesObject = changes["notes"].newValue;
      state.notes = newNotes;

      state.clipboard = changes["clipboard"] ? changes["clipboard"].newValue : state.clipboard;

      // Auto-activate the created note
      const newActive = changes["active"] && changes["active"].newValue;
      if (newActive && newActive in newNotes) {
        state.active = newActive;
        notesHistory.push(newActive);
        return;
      }

      // This should not happen (fallback)
      if (!state.active) {
        const newActive = Object.keys(newNotes).sort()[0];
        if (newActive) {
          state.active = newActive;
        }
        return;
      }

      // Reactivate edited note in other tabs only
      // Reactive clipboard if edited from background using Context menu
      if (
        (state.active in oldNotes) &&
        (state.active in newNotes) &&
        (newNotes[state.active].content !== oldNotes[state.active].content) &&
        ((localStorage.getItem("notesChangedBy") !== tabId) || changes["clipboard"])
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

      // Activate first available note if some note was deleted
      const oldSet = new Set(Object.keys(oldNotes));
      const newSet = new Set(Object.keys(newNotes));
      if (oldSet.size > newSet.size) {
        const newActive = Object.keys(newNotes).sort()[0] || null;
        state.active = newActive;
        notesHistory.replace(newActive || "");
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

    if (changes["clipboard"]) {
      state.clipboard = changes["clipboard"].newValue;
    }
  }

  if (areaName === "sync") {
    if (changes["selection"]) {
      const selection = changes["selection"].newValue as ContextMenuSelection;
      if (!selection || !selection.text) { return; }
      chrome.storage.local.get(["id"], local => {
        if (selection.sender === local.id) { return; }
        sendMessage(MessageType.SAVE_TO_CLIPBOARD, selection.text);
      });
    }
  }
});

const openLink = (event: MouseEvent) => {
  if (!document.body.classList.contains("with-control")) {
    return;
  }

  event.preventDefault();
  const target = event.target as HTMLLinkElement;
  if (target && target.href && target.href.startsWith("http")) {
    window.open(target.href, "_blank");
  }
};

content.addEventListener("click", openLink); // Chrome OS, Windows
content.addEventListener("contextmenu", openLink); // OSX would open Context menu when holding Ctrl

window.addEventListener("blur", () => {
  document.body.classList.remove("with-control");
});

// History
notesHistory.attach(state);

// Notes are saved every 1 second by "saveNotesDebounce()"
// When the window is closed sooner, save the notes immediately, if changed
window.addEventListener("beforeunload", () => {
  // Save the most recent version of notes (changes are gathered across Tabs)
  saveNotes(state.notes);
});
