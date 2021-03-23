import {
  setId,
  migrations,
  contextMenu,
  notifications,
  open,
  drop,
  commands,

  googleDrive,
} from "./background/init/index";

// Click My Notes icon, "Open My Notes in every New Tab" (see Options)
open.attach();

// Context menu ("Save selected text to Clipboard", "Save selected text to Clipboard in other devices")
contextMenu.attach();

// Notifications (NEW VERSION installed)
notifications.attach();

// Drop text onto a note in Sidebar
drop.attach();

// Commands
commands.attach();

// Google Drive Sync
googleDrive.attach();

// Run when Installed or Updated
chrome.runtime.onInstalled.addListener(() => {
  setId(); // Set unique My Notes ID, if not set before
  migrations.run(); // Migrate notes and options (font type, font size, etc.)
  contextMenu.create(); // Create Context menu
});
