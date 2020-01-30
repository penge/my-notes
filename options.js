"use strict";

(function () {

/* global chrome */

/* Font elements */

const generics = [
  document.getElementById("serif"),
  document.getElementById("sans-serif"),
  document.getElementById("monospace")
];

const fonts = [
  document.getElementById("serif-fonts"),
  document.getElementById("sans-serif-fonts"),
  document.getElementById("monospace-fonts")
];

const fontRadios = document.getElementsByName("font");
const currentFontName = document.getElementById("current-font-name");


/* Size elements */

const sizeRange = document.getElementById("size-range");
const currentSize = document.getElementById("current-size");


/* Mode elements */

const modeRadios = document.getElementsByName("mode");


/* Focus elements */

const focusCheckbox = document.getElementById("focus");


/* Helpers */

function setCurrentFontNameText(fontName) {
  currentFontName.innerText = fontName;
}

function checkById(id) {
  document.getElementById(id).checked = true;
}

function displayGeneric(id) {
  // Underline current generic only
  generics.forEach(generic => {
    const decoration = generic.id === id ? "underline" : "";
    generic.style.textDecoration = decoration;
  });

  // Display current generic fonts only
  fonts.forEach(font => {
    const display = (font.id === id + '-fonts') ? "block" : "none";
    font.style.display = display;
  });
}


/* Events */

generics.forEach(generic => {
  generic.addEventListener("click", function () {
    displayGeneric(this.id); // "serif", "sans-serif", "monospace"
  });
});

fontRadios.forEach(radio => {
  radio.addEventListener("click", function () {
    const font = {
      id: this.id, // "courier-new"
      name: this.value, // "Courier New"
      genericFamily: this.dataset.generic, // "monospace"
      fontFamily: [this.value, this.dataset.generic].join(',') // "Courier New,monospace"
    };

    chrome.storage.local.set({ font: font });
    setCurrentFontNameText(font.name);
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


/* Storage helpers */

const applyFont = (font) => {
  const currentFont = font; // see background.js
  const currentGeneric = currentFont.genericFamily;

  // Display the name of the current font
  setCurrentFontNameText(currentFont.name);

  // Check the current font
  checkById(currentFont.id);

  // Underline the generic and display its fonts
  displayGeneric(currentGeneric);
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


/* Storage */

chrome.storage.local.get(["font", "size", "mode", "focus"], local => {
  const { font, size, mode, focus } = local;
  applyFont(font);
  applySize(size);
  applyMode(mode);
  applyFocus(focus);
});

const apply = (change, applyHandler) => {
  if (change) {
    applyHandler(change.newValue);
  }
};

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    apply(changes["font"], applyFont);
    apply(changes["size"], applySize);
    apply(changes["mode"], applyMode);
    apply(changes["focus"], applyFocus);
  }
});

})(); // IIFE
