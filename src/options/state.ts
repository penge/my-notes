import formatDate from "shared/date/format-date";
import { GoogleFont, RegularFont, Sync } from "shared/storage/schema";

import {
  currentSize,
  sizeRange,
  newtabCheckbox,
  tabCheckbox,
  syncCheckbox,
  syncFolderLocation,
  syncLastSync,
  version,
} from "./elements";

import {
  setCurrentFontNameText,
  checkById,
  displayFontCategory,
} from "./helpers";

import setThemeCore, { SetThemeOptions } from "../themes/set-theme";

const setFont = (font: RegularFont | GoogleFont): void => {
  // Display the name of the current font
  setCurrentFontNameText(font);

  // Check the current font (except "Google Fonts" where is no radio button)
  checkById(font.id);

  // Underline the generic and display its fonts
  displayFontCategory((font as RegularFont).genericFamily || "google-fonts");
};

const setSize = (size: number): void => {
  currentSize.innerText = size + "%";
  sizeRange.value = size.toString();
};

const setTheme = ({ name, customTheme }: SetThemeOptions): void => {
  checkById(name);
  setThemeCore({ name, customTheme });
};

const setNewtab = (newtab: boolean): void => {
  newtabCheckbox.checked = newtab;
};

const setTab = (tab: boolean): void => {
  tabCheckbox.checked = tab;
};

const setSync = (sync: Sync): void => {
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

const setChange = <T>(change: chrome.storage.StorageChange, applyHandler: (newValue: T) => void): void => {
  if (change) { applyHandler(change.newValue); }
};

const setVersion = (string: string): void => {
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
