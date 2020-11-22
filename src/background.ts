import {
  setId,
  migrations,
  contextMenu,
  notifications,
  open,

  googleDrive,
} from "./background/init/index";

// Run when Installed or Updated
chrome.runtime.onInstalled.addListener(() => {
  setId(); // Set unique My Notes ID, if not set before
  migrations.run(); // Migrate notes and options (font type, font size, etc.)
  contextMenu.create(); // Create Context menu
});

// Context menu ("Save selection", "Save selection to other devices")
contextMenu.attach();

// Notifications (NEW VERSION installed)
notifications.attach();

// Click My Notes icon, "Open My Notes in every New Tab" (see Options)
open.attach();

// Google Drive Sync
googleDrive.attach();
