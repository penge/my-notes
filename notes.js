"use strict";

(function () {

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

let mostRecentValue;
let mostRecentSavedValue;

chrome.storage.sync.get(["value", "size", "font", "mode"], result => {
  textarea.value = result.value || "";
  mostRecentValue = textarea.value;
  mostRecentSavedValue = textarea.value;

  textarea.style.fontSize = (result.size || defaultSize) + "%";
  textarea.style.fontFamily = result.font.fontFamily;

  setPlaceholder();
  setMode(result.mode || defaultMode);
});


/* Typing */

const TAB = "  ";

function isTab(event) {
  return event.keyCode === 9 || event.which === 9 || event.key === "Tab";
}

function isShift(event) {
  return event.shiftKey;
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function saveText() {
  if (mostRecentValue === mostRecentSavedValue) {
    return;
  }

  const value = textarea.value;
  chrome.storage.sync.set({ value: value }, function () {
    mostRecentSavedValue = value;
  });
}

const saveTextDebounce = debounce(saveText, 1000, true);

textarea.addEventListener("keydown", (event) => {
  if (isTab(event)) {
    event.preventDefault();
  }
});

textarea.addEventListener("keyup", (event) => {
  if (isTab(event)) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      let before = textarea.value.substring(0, start);
      let after = textarea.value.substring(start);
      let movement = isShift(event) ? (TAB.length * -1) : TAB.length;
      let change = false;

      if (movement > 0) { // only TAB
        before = before + TAB;
        change = true;

      }
      else { // SHIFT + TAB
        for (let i = 1; i <= Math.abs(movement); i++) {
          if (before.endsWith(" ")) {
            before = before.substring(0, before.length - 1);
            change = true;
          }
          else {
            movement = (i - 1) * -1;
            break;
          }
        }
      }

      if (change) {
        textarea.value = before + after;
        textarea.selectionStart = start + movement;
        textarea.selectionEnd = end + movement;
      }
    }
  }

  // Do not save text if unchanged (Ctrl, Alt, Shift, Arrow keys)
  if (mostRecentValue === textarea.value) {
    return;
  }

  mostRecentValue = textarea.value;
  setPlaceholder();
  saveTextDebounce();
});

window.addEventListener("beforeunload", saveText);

})(); // IIFE
