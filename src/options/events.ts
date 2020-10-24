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

  // Options
  newtabCheckbox,
  syncCheckbox,
  tabCheckbox,
} from "./elements";

import {
  setCurrentFontNameText,
  displayFontCategory,
  uncheckAll,
} from "./helpers";

import { getFontId, getFontFamily } from "./font-helpers";
import { getGoogleFontHref } from "./google-fonts";

import { requestPermission, removePermission } from "../shared/permissions/index";
import { setItem } from "../shared/storage/index";
import { RegularFont, Theme, MessageType } from "shared/storage/schema";
import { sendMessage } from "messages/index";

function attachFontCategories() {
  for (const category of fontCategories) {
    category.addEventListener("click", function () {
      displayFontCategory(category.id);
    });
  }
}

function attachFontRadios() {
  fontRadios.forEach(radio => {
    radio.addEventListener("click", function () {
      const font: RegularFont = {
        id: this.id, // "courier-new"
        name: this.value, // "Courier New"
        genericFamily: this.dataset.generic || "monospace", // "monospace"
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
    currentSize.innerText = sizeRange.value + "%";
  };

  sizeRange.onchange = function () {
    const size = parseInt(sizeRange.value);
    chrome.storage.local.set({ size: size });
  };
}

function attachThemeRadios() {
  themeRadios.forEach(radio => {
    radio.addEventListener("click", function () {
      const theme = radio.id as Theme;
      if (theme) {
        chrome.storage.local.set({ theme: theme });
      }
    });
  });
}

function attachNewtabCheckbox() {
  newtabCheckbox.addEventListener("click", async function () {
    if (newtabCheckbox.checked) { // request permission on check
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
  syncCheckbox.addEventListener("click", async function () {
    if (syncCheckbox.checked) { // request permission on check
      const granted = await requestPermission("identity");
      syncCheckbox.checked = granted;
      if (granted) {
        sendMessage(MessageType.SYNC_INITIATE);
      }
      return;
    }

    const removed = await removePermission("identity");
    if (removed) {
      sendMessage(MessageType.SYNC_STOP);
      syncCheckbox.checked = false;
    }
  });
}

function attachTabCheckbox() {
  tabCheckbox.addEventListener("click", function () {
    chrome.storage.local.set({ tab: this.checked });
  });
}

const attachEvents = (): void => {
  // Appearance
  attachFontCategories();
  attachFontRadios();
  attachFontNameInput();
  attachSubmit();
  attachSizeRange();
  attachThemeRadios();

  // Options
  attachNewtabCheckbox();
  attachSyncCheckbox();
  attachTabCheckbox();
};

export { attachEvents };
