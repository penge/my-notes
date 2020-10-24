// Notifications
import showNotification from "./show-notification";

// Appearance
import setFont from "./set-font";
import setSize from "./set-size";
import setFocus from "./set-focus";
import setSidebar from "./set-sidebar";
import setToolbar from "./set-toolbar";
import setTheme from "../../themes/set-theme";

// Notes
import setNotes from "./set-notes";
import setActive from "./set-active";

// Sync
import setSync from "./set-sync";

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
