"use strict";

(function () {

/* global chrome */

/* Elements */

var generics = [
  document.getElementById("serif"),
  document.getElementById("sans-serif"),
  document.getElementById("monospace")
];

var fonts = [
  document.getElementById("serif-fonts"),
  document.getElementById("sans-serif-fonts"),
  document.getElementById("monospace-fonts")
];

var checkboxes = document.getElementsByName("font");
var currentFontName = document.getElementById("current-font-name");


/* Helpers */

function setCurrentFontNameText(fontName) {
  currentFontName.innerText = fontName;
}

function checkCurrentFontCheckbox(fontId) {
  document.getElementById(fontId).checked = true;
}

function displayGeneric(id) {
  generics.forEach(generic => {
    var decoration = generic.id === id ? "underline" : "";
    generic.style.textDecoration = decoration;
  });

  fonts.forEach(font => {
    var display = (font.id === id + '-fonts') ? "block" : "none";
    font.style.display = display;
  });
}


/* Events */

generics.forEach(generic => {
  generic.addEventListener("click", function () {
    displayGeneric(this.id);
  });
});


checkboxes.forEach(checkbox => {
  checkbox.addEventListener("click", function () {
    var font = {
      id: this.id,
      name: this.value,
      genericFamily: this.dataset.generic,
      fontFamily: [this.value, this.dataset.generic].join(',')
    };

    chrome.storage.sync.set({ font: font });
    setCurrentFontNameText(font.name);
  });
});


/* Storage */

chrome.storage.sync.get(["font"], result => {
  var currentFont = result.font; // see background.js
  var currentGeneric = currentFont.genericFamily;

  // Display the name of the current font
  setCurrentFontNameText(currentFont.name);

  // Check the current font
  checkCurrentFontCheckbox(currentFont.id);

  // Underline the generic and display its fonts
  displayGeneric(currentGeneric);
});

})(); // IIFE
