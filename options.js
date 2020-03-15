"use strict";

(function () {

/* global chrome */

const commonFonts = {
  "serif": [
    "Georgia",
    "Palatino Linotype",
    "Times New Roman",
    "Times",
  ],
  "sans-serif": [
    "Arial",
    "Arial Black",
    "Comic Sans MS",
    "Impact",
    "Lucida Sans Unicode",
    "Roboto",
    "Tahoma",
    "Trebuchet MS",
    "Verdana",
  ],
  "monospace": [
    "Courier",
    "Courier New",
    "Lucida Console",
    "Monaco",
  ],
};

const getFontId = (fontName) =>
  fontName.toLowerCase().replace(" ", "-");

const getFontFamily = (fontName) => {
  const span = document.createElement("span");
  span.style.fontFamily = fontName; // '"Roboto Mono"'
  return span.style.fontFamily;
};

const getGoogleFontHref = (fontName) => {
  const family = fontName.replace(" ", "+");
  const href = `https://fonts.googleapis.com/css?family=${family}:400,700&display=swap`;
  return href;
};

// Renders commonFonts into #commonfonts
// Rendering is based on <template> in options.html
const renderCommonFonts = () => {
  const generics = Object.keys(commonFonts);
  const fragment = document.createDocumentFragment();
  const template = document.getElementById("font-area-template");
  for (const generic of generics) {
    const node = template.content.cloneNode(true);
    const fontArea = node.children[0];
    fontArea.id = generic + "-area"; // "monospace-area"

    const selections = document.createDocumentFragment();
    for (const fontName of commonFonts[generic]) {
      const selection = fontArea.children[0].cloneNode(true);
      const input = selection.children[0];
      const label = selection.children[1];

      // "Courier New" -> "courier-new"
      const fontId = getFontId(fontName);

      // "Courier New,monospace"
      const fontFamily = [fontName,generic].join(",");

      // <input type="radio" id="" name="font" value="" data-generic="" style="">
      input.id = fontId;
      input.value = fontName;
      input.dataset.generic = generic;
      input.style.fontFamily = fontFamily;

      // <label for="" style="">The quick brown fox jumps over the lazy dog (<span>fontName</span>)</label>
      label.htmlFor = fontId;
      label.style.fontFamily = fontFamily;
      label.children[0].innerText = fontName;

      selections.appendChild(selection);
    }
    fontArea.removeChild(fontArea.children[0]);
    fontArea.appendChild(selections);
    fragment.appendChild(node);
  }
  document.getElementById("commonfonts").appendChild(fragment);
};
renderCommonFonts();


/* Elements */

const fontCategories = document.getElementsByClassName("font-category");
const fontAreas = document.getElementsByClassName("font-area");
const fontRadios = document.getElementsByName("font");
const currentFontName = document.getElementById("current-font-name");
const fontNameInput = document.getElementById("font-name-input");
const submit = document.getElementById("submit");

const sizeRange = document.getElementById("size-range");
const currentSize = document.getElementById("current-size");

const modeRadios = document.getElementsByName("mode");

const focusCheckbox = document.getElementById("focus");
const newtabCheckbox = document.getElementById("newtab");


/* Helpers */

function setCurrentFontNameText(font) {
  currentFontName.innerText = font.name;
  fontNameInput.value = font.href ? font.name : "";
}

function checkById(id) {
  const element = document.getElementById(id);
  // Radio does not exist in case of "Google Fonts"
  if (element) { element.checked = true; }
}

function uncheckAll(radios) {
  for (const radio of radios) {
    radio.checked = false;
  };
}

function displayFontCategory(id) {
  for (const category of fontCategories) {
    category.classList.toggle("active", category.id === id);
  };

  for (const area of fontAreas) {
    area.classList.toggle("hide", area.id !== id + "-area");
  };
}


/* Events */

for (const category of fontCategories) {
  category.addEventListener("click", function () {
    displayFontCategory(this.id);
  });
};

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

const validFormNameInput = () => {
  const fontName = fontNameInput.value.trim();
  const isSet = fontName.length > 0;
  const isNotSame = currentFontName.innerText !== fontName;
  return isSet && isNotSame;
};

fontNameInput.oninput = function () {
  submit.value = "Apply";
  submit.classList.toggle("active", validFormNameInput());
};

submit.addEventListener("click", function () {
  if (!validFormNameInput()) { return; }
  const fontName = fontNameInput.value.trim();
  // In case of commonFonts, "fontId" is used to check the radio button
  // of the current font (upon opening Options).
  // In case of googlefonts, this attribute is not necessary.
  const fontId = getFontId(fontName);
  const fontFamily = getFontFamily(fontName);
  const fontHref = getGoogleFontHref(fontName);

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
  })
  .catch(() => {
    submit.classList.remove("active");
    submit.value= "Font Name Doesn't Exist";
  });
});

sizeRange.oninput = function () {
  currentSize.innerText = this.value;
};

sizeRange.onchange = function () {
  chrome.storage.local.set({ size: this.value });
};

modeRadios.forEach(radio => {
  radio.addEventListener("click", function () {
    const mode = this.id; // "light", "dark"
    document.body.id = mode;
    chrome.storage.local.set({ mode: mode });
  });
});

focusCheckbox.addEventListener("click", function () {
  chrome.storage.local.set({ focus: this.checked });
});

newtabCheckbox.addEventListener("click", function () {
  if (newtabCheckbox.checked) {
    chrome.permissions.request({ permissions: ["tabs"] }, granted => {
      newtabCheckbox.checked = granted;
      chrome.storage.local.set({ newtab: granted });
    });
    return;
  }

  chrome.permissions.remove({ permissions: ["tabs"] }, removed => {
    if (removed) {
      newtabCheckbox.checked = false;
      chrome.storage.local.set({ newtab: false });
    }
  });
});


/* Storage helpers */

const applyFont = (font) => {
  // Display the name of the current font
  setCurrentFontNameText(font);

  // Check the current font (except "Google Fonts" where is no radio button)
  checkById(font.id);

  // Underline the generic and display its fonts
  displayFontCategory(font.genericFamily || "googlefonts");
};

const applySize = (size) => {
  sizeRange.value = size;
  currentSize.innerText = size;
};

const applyMode = (mode) => {
  checkById(mode);
  document.body.id = mode;
};

const applyFocus = (focus) => {
  focusCheckbox.checked = focus;
};

const applyNewtab = (newtab) => {
  newtabCheckbox.checked = newtab;
};


/* Storage */

chrome.storage.local.get(["font", "size", "mode", "focus", "newtab"], local => {
  const { font, size, mode, focus, newtab } = local;
  applyFont(font);
  applySize(size);
  applyMode(mode);
  applyFocus(focus);
  applyNewtab(newtab);
});

const apply = (change, applyHandler) => {
  if (change) { applyHandler(change.newValue); }
};

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    apply(changes["font"], applyFont);
    apply(changes["size"], applySize);
    apply(changes["mode"], applyMode);
    apply(changes["focus"], applyFocus);
    apply(changes["newtab"], applyNewtab);
  }
});

const setVersion = () => {
  const version = chrome.runtime.getManifest().version;
  document.getElementById("version").innerText = version;
};
setVersion();

})(); // IIFE
