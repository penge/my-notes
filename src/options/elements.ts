import { getElementById as _get } from "dom/index";

// Font
const currentFontName = _get("current-font-name");
const fontCategories = document.getElementsByClassName("font-category");
const fontAreas = document.getElementsByClassName("font-area");
const fontRadios = document.getElementsByName("font") as NodeListOf<HTMLInputElement>;
const fontNameInput = _get("font-name-input") as HTMLInputElement;
const submit = _get("submit") as HTMLInputElement;

// Font size
const currentSize = _get("current-size");
const sizeRange = _get("size-range") as HTMLInputElement;

// Theme ("light", "dark", "custom")
const themeRadios = document.getElementsByName("theme") as NodeListOf<HTMLInputElement>;

// Checkboxes
const newtabCheckbox = _get("newtab") as HTMLInputElement;
const syncCheckbox = _get("sync") as HTMLInputElement;
const tabCheckbox = _get("tab") as HTMLInputElement;

// Sync
const syncFolderLocation = _get("sync-folder-location") as HTMLAnchorElement;
const syncLastSync = _get("sync-last-sync");

// Version
const version = _get("version");

export {
  // Font type
  currentFontName,
  fontCategories,
  fontAreas,
  fontRadios,
  fontNameInput,
  submit,

  // Font size
  currentSize,
  sizeRange,

  // Theme
  themeRadios,

  // Checkboxes
  newtabCheckbox,
  syncCheckbox,
  tabCheckbox,

  // Sync
  syncFolderLocation,
  syncLastSync,

  // Version
  version,
};
