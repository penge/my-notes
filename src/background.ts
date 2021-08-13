import { setId } from "background/init/id";
import { runMigrations } from "background/init/migrations";
import { showNewVersionNotification } from "background/init/notifications";

import {
  openMyNotesOnIconClick,
  openMyNotesOnKeyboardShortcut,
} from "background/init/open";

import {
  registerGoogleDriveMessages,
} from "background/init/google-drive";

import {
  attachContextMenuOnClicked,
  createAndUpdateContextMenuFromNotes,
} from "background/init/context-menu";

import {
  saveTextOnDrop,
  saveTextOnRemoteTransfer,
} from "background/init/saving";

import {
  handleChangedPermissions,
} from "background/init/permissions";

// Run when Installed or Updated
chrome.runtime.onInstalled.addListener((details) => {
  setId(); // Set unique My Notes ID, if not set before
  runMigrations(); // Migrate notes and options (font type, font size, etc.)
  showNewVersionNotification(details); // Notifications (NEW VERSION installed)
});

// Click on My Notes icon, or use a keyboard shortcut (see chrome://extensions/shortcuts)
openMyNotesOnIconClick();
openMyNotesOnKeyboardShortcut();

// Google Drive Sync
registerGoogleDriveMessages();

// Context menu
attachContextMenuOnClicked();
createAndUpdateContextMenuFromNotes();

// Other ways to update note
saveTextOnDrop(); // when you drop text onto a note in Sidebar
saveTextOnRemoteTransfer(); // when you use "Save to remotely open My Notes" from the context menu

// Permissions
handleChangedPermissions(); // react to granted/removed optional permissions: "identity"
