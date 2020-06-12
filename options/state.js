import {
  currentSize,
  sizeRange,
  newtabCheckbox,
  tabCheckbox,
  syncCheckbox,
  syncFolderLocation,
  syncLastSync,
  version,
} from "./elements.js";

import {
  setCurrentFontNameText,
  checkById,
  displayFontCategory,
} from "./helpers.js";

import formatDate from "../shared/date/format-date.js";
import setThemeCore from "../themes/set-theme.js";

const setFont = (font) => {
  // Display the name of the current font
  setCurrentFontNameText(font);

  // Check the current font (except "Google Fonts" where is no radio button)
  checkById(font.id);

  // Underline the generic and display its fonts
  displayFontCategory(font.genericFamily || "google-fonts");
};

const setSize = (size) => {
  currentSize.innerText = size + "%";
  sizeRange.value = size;
};

const setTheme = (theme, customTheme) => {
  checkById(theme);
  setThemeCore(theme, customTheme);
};

const setNewtab = (newtab) => {
  newtabCheckbox.checked = newtab;
};

const setTab = (tab) => {
  tabCheckbox.checked = tab;
};

const setSync = (sync) => {
  if (!sync) {
    syncCheckbox.checked = false;

    syncFolderLocation.href = "";
    syncFolderLocation.innerText = "";

    syncLastSync.innerText = "";

    return;
  }

  syncCheckbox.checked = true;

  const { folderLocation, lastSync } = sync;

  syncFolderLocation.href = folderLocation;
  syncFolderLocation.innerText = folderLocation;

  syncLastSync.innerText = lastSync ? formatDate(lastSync) : "In progress...";
};

const setChange = (change, applyHandler) => {
  if (change) { applyHandler(change.newValue); }
};

const setVersion = (string) => {
  version.innerHTML = string;
};

export {
  setFont,
  setSize,
  setTheme,
  setNewtab,
  setTab,
  setSync,

  setChange,
  setVersion,
};
