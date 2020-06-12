/* global document */

// Font
const currentFontName = document.getElementById("current-font-name");
const fontCategories = document.getElementsByClassName("font-category");
const fontAreas = document.getElementsByClassName("font-area");
const fontRadios = document.getElementsByName("font");
const fontNameInput = document.getElementById("font-name-input");
const submit = document.getElementById("submit");

// Font size
const currentSize = document.getElementById("current-size");
const sizeRange = document.getElementById("size-range");

// Theme ("light", "dark", "custom")
const themeRadios = document.getElementsByName("theme");

// Checkboxes
const newtabCheckbox = document.getElementById("newtab");
const syncCheckbox = document.getElementById("sync");
const tabCheckbox = document.getElementById("tab");

// Sync
const syncFolderLocation = document.getElementById("sync-folder-location");
const syncLastSync = document.getElementById("sync-last-sync");

// Version
const version = document.getElementById("version");

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
