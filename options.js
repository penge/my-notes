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

const size = document.getElementById("size");
const currentSize = document.getElementById("current-size");


/* Mode elements */

const modeRadios = document.getElementsByName("mode");


/* Focus elements */

const focusRadio = document.getElementById("focus");


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

size.oninput = function () {
  currentSize.innerText = this.value;
};

size.onchange = function () {
  chrome.storage.local.set({ size: this.value });
};

modeRadios.forEach(radio => {
  radio.addEventListener("click", function () {
    const mode = this.id; // "light", "dark"
    document.body.id = mode;
    chrome.storage.local.set({ mode: mode });
  });
});

focusRadio.addEventListener("click", function () {
  chrome.storage.local.set({ focus: this.checked });
})


/* Storage */

chrome.storage.local.get(["font", "size", "mode", "focus"], local => {
  // 1 FONT
  const currentFont = local.font; // see background.js
  const currentGeneric = currentFont.genericFamily;

  // Display the name of the current font
  setCurrentFontNameText(currentFont.name);

  // Check the current font
  checkById(currentFont.id);

  // Underline the generic and display its fonts
  displayGeneric(currentGeneric);

  // 2 SIZE
  size.value = local.size;
  currentSize.innerText = local.size;

  // 3 MODE
  checkById(local.mode);
  document.body.id = local.mode;

  // 4 FOCUS
  focusRadio.checked = local.focus;
});

})(); // IIFE
