/* global chrome, document, fetch */

import {
  // Appearance
  currentFontName,
  fontCategories,
  fontRadios,
  fontNameInput,
  submit,
  currentSize,
  sizeRange,
  themeRadios,
  customInputs,

  // Options
  focusCheckbox,
  newtabCheckbox,
  syncCheckbox,
  tabCheckbox,
} from "./elements.js";

import {
  setCurrentFontNameText,
  displayFontCategory,
  uncheckAll,
} from "./helpers.js";

import { getFontId, getFontFamily } from "./font-helpers.js";
import { getGoogleFontHref } from "./google-fonts.js";
import {
  requestGoogleDriveAccess,
  removeGoogleDriveAccess
} from "./google-drive.js";

import { requestPermission, removePermission } from "../shared/permissions/index.js";
import { setItem } from "../shared/storage/index.js";

import { THEMES } from "../shared/storage/default-values.js";
import { initCustomTheme } from "../themes/custom.js";

function attachFontCategories() {
  for (const category of fontCategories) {
    category.addEventListener("click", function () {
      displayFontCategory(this.id);
    });
  }
}

function attachFontRadios() {
  fontRadios.forEach(radio => {
    radio.addEventListener("click", function () {
      const font = {
        id: this.id, // "courier-new"
        name: this.value, // "Courier New"
        genericFamily: this.dataset.generic, // "monospace"
        fontFamily: this.style.fontFamily, // '"Courier New", monospace'
      };

      chrome.storage.local.set({ font: font });
      setCurrentFontNameText(font);
    });
  });
}

const validFormNameInput = () => {
  const fontName = fontNameInput.value.trim();
  const isSet = fontName.length > 0;
  const isNotSame = currentFontName.innerText !== fontName;
  return isSet && isNotSame;
};

function attachFontNameInput() {
  fontNameInput.oninput = function () {
    submit.value = "Apply";
    submit.classList.toggle("active", validFormNameInput());
  };
}

function attachSubmit() {
  submit.addEventListener("click", function () {
    if (!validFormNameInput()) { return; }
    const fontName = fontNameInput.value.trim();
    // In case of commonFonts, "fontId" is used to check the radio button
    // of the current font (upon opening Options).
    // In case of googleFonts, this attribute is not necessary.
    const fontId = getFontId(fontName);
    const fontFamily = getFontFamily(fontName);
    const fontHref = getGoogleFontHref(fontName);

    // Try to read Google Font by the user provided Font Name
    fetch(fontHref, { method: "HEAD" }).then(() => {
      const font = {
        id: fontId, // "roboto-mono"
        name: fontName, // "Roboto Mono"
        fontFamily: fontFamily, // '"Roboto Mono"'
        href: fontHref,
      };
      uncheckAll(fontRadios);
      setCurrentFontNameText(font);
      submit.value= "Applied";
      chrome.storage.local.set({ font: font });
    }).catch(() => {
      submit.classList.remove("active");
      submit.value= "Font Name Doesn't Exist";
    });
  });
}

function attachSizeRange() {
  sizeRange.oninput = function () {
    currentSize.innerText = this.value + "%";
  };

  sizeRange.onchange = function () {
    const size = parseInt(this.value);
    chrome.storage.local.set({ size: size });
  };
}

function attachThemeRadios() {
  themeRadios.forEach(radio => {
    radio.addEventListener("click", function () {
      const theme = this.id; // "light", "dark", "custom"
      if (THEMES.includes(theme)) {
        document.body.id = theme;
        chrome.storage.local.set({ theme: theme });
      }
    });
  });
}

function attachCustomTheme() {
  customInputs.forEach(input => {
    input.addEventListener("change", function() {
      const key = this.dataset.key;
      const value = this.value;

      chrome.storage.local.get("customTheme", local => {
        const customTheme = local.customTheme;
        customTheme[key] = value;
        chrome.storage.local.set({ customTheme: customTheme }, () => {
          initCustomTheme(customTheme);
        });
      });
    });
  });
}

function attachFocusCheckbox() {
  focusCheckbox.addEventListener("click", function () {
    chrome.storage.local.set({ focus: this.checked });
  });
}

function attachNewtabCheckbox() {
  newtabCheckbox.addEventListener("click", async function () {
    if (newtabCheckbox.checked) {
      const granted = await requestPermission("tabs");
      newtabCheckbox.checked = granted;
      await setItem("newtab", granted);
      return;
    }

    const removed = await removePermission("tabs");
    if (removed) {
      newtabCheckbox.checked = false;
      await setItem("newtab", false);
    }
  });
}

function attachSyncCheckbox() {
  syncCheckbox.addEventListener("click", function () {
    // Check => Request access
    if (syncCheckbox.checked === true) {
      requestGoogleDriveAccess().then(sync => {
        syncCheckbox.checked = typeof sync === "object";
        if (sync) {
          chrome.runtime.sendMessage({ type: "SYNC" });
        }
      });
    }

    // Uncheck => Remove access
    if (syncCheckbox.checked === false) {
      removeGoogleDriveAccess().then(() => {
        syncCheckbox.checked = false;
      });
    }
  });
}

function attachTabCheckbox() {
  tabCheckbox.addEventListener("click", function () {
    chrome.storage.local.set({ tab: this.checked });
  });
}

const attachEvents = () => {
  // Appearance
  attachFontCategories();
  attachFontRadios();
  attachFontNameInput();
  attachSubmit();
  attachSizeRange();
  attachThemeRadios();
  attachCustomTheme();

  // Options
  attachFocusCheckbox();
  attachNewtabCheckbox();
  attachSyncCheckbox();
  attachTabCheckbox();
};

export { attachEvents };
