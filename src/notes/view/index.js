// Notifications
import showNotification from "./show-notification.js";

// Appearance
import setFont from "./set-font.js";
import setSize from "./set-size.js";
import setFocus from "./set-focus.js";
import setSidebar from "./set-sidebar.js";
import setToolbar from "./set-toolbar.js";
import setTheme from "../../themes/set-theme.js";

// Notes
import setNotes from "./set-notes.js";
import setActive from "./set-active.js";

// Sync
import setSync from "./set-sync.js";

export default {
  // Notifications
  showNotification,

  // Appearance
  setFont,
  setSize,
  setFocus,
  setSidebar,
  setToolbar,
  setTheme, // sets opacity to 1; prefer to call setTheme as the last UI update

  // Notes
  setNotes,
  setActive,

  // Sync
  setSync,
};
