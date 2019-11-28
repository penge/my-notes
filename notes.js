"use strict";

(function() {

/* global chrome */

/* Elements */

const textarea = document.getElementById("textarea");
const mode = document.getElementById("mode");
const minus = document.getElementById("minus");
const plus = document.getElementById("plus");


/* Helpers */

const setPlaceholder = () => {
  if (textarea.value === "") {
    textarea.placeholder = "Type your notes here.";
  }
};

const currentSize = () => {
  return parseInt(textarea.style.fontSize.replace("%", ""), 10);
};

const changeSize = (size) => {
  textarea.style.fontSize = size + "%";
  chrome.storage.sync.set({ size: size });
};

const setMode = (mode) => {
  document.body.id = mode;
  chrome.storage.sync.set({ mode: mode });
};


/* Font size */

const minSize = 100;
const maxSize = 600;
const defaultSize = 200;

minus.addEventListener("click", function () {
  const size = currentSize() - 25;
  if (size >= minSize) {
    changeSize(size);
  }
});

plus.addEventListener("click", function () {
  const size = currentSize() + 25;
  if (size <= maxSize) {
    changeSize(size);
  }
});


/* Mode */

const defaultMode = "light";
let currentMode = "light";

mode.addEventListener("click", function () {
  currentMode = currentMode === "light" ? "dark" : "light";
  setMode(currentMode);
});


/* Storage */

chrome.storage.sync.get(["value", "size", "font", "mode"], result => {
  textarea.value = result.value || "";
  textarea.style.fontSize = (result.size || defaultSize) + "%";
  textarea.style.fontFamily = result.font.fontFamily;
  setPlaceholder();
  setMode(result.mode || defaultMode);
});

textarea.addEventListener("keyup", () => {
  chrome.storage.sync.set({ value: textarea.value });
  setPlaceholder();
});

})(); // IIFE
