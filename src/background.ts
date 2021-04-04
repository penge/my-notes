import { setId } from "background/init/id";
import { runMigrations } from "background/init/migrations";
import { showNewVersionNotification } from "background/init/notifications";
import { openMyNotesOnIconClick, openMyNotesOnKeyboardShortcut } from "background/init/open";
import { registerGoogleDriveMessages } from "background/init/google-drive";
import { recreateContextMenu } from "background/init/context-menu";
import { saveTextOnDrop, saveTextToLocalMyNotes } from "background/init/saving";

import {
  NotesObject,
  ContextMenuSelection,
} from "shared/storage/schema";

// Run when Installed or Updated
chrome.runtime.onInstalled.addListener((details) => {
  setId(); // Set unique My Notes ID, if not set before
  runMigrations(); // Migrate notes and options (font type, font size, etc.)
  showNewVersionNotification(details); // Notifications (NEW VERSION installed)
});

// Click on My Notes icon, or use a keyboard shortcut (see chrome://extensions/shortcuts)
openMyNotesOnIconClick();
openMyNotesOnKeyboardShortcut();

// Drop text onto a note in Sidebar
saveTextOnDrop();

// Google Drive Sync
registerGoogleDriveMessages();

// Context menu
const recreateContextMenuFromNotes = (notes: NotesObject) => {
  const noteNames = Object.keys(notes).sort();
  recreateContextMenu(noteNames);
};

chrome.storage.local.get("notes", (local) => {
  recreateContextMenuFromNotes(local.notes as NotesObject);
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes["notes"]) {
    recreateContextMenuFromNotes(changes.notes.newValue as NotesObject);
  }

  // Used by "Save to remotely open My Notes"
  if (areaName === "sync" && changes["selection"]) {
    const selection = changes["selection"].newValue as ContextMenuSelection;
    if (!selection || !selection.text) {
      return;
    }

    chrome.storage.local.get(["id"], local => {
      if (selection.sender === local.id) {
        return;
      }

      saveTextToLocalMyNotes(selection.text, "@Received");
    });
  }
});
