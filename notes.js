"use strict";

(function () {

/* global chrome */

/* Elements */

const textarea = document.getElementById("textarea");
const settings = document.getElementById("settings");
const page = document.getElementById("page");
const minus = document.getElementById("minus");
const plus = document.getElementById("plus");


/* Placeholder */

const setPlaceholder = () => {
  if (textarea.value === "") {
    textarea.placeholder = "Type your notes here.";
  }
};


/* Font */

const setFont = (font) => {
  textarea.style.fontFamily = font;
};


/* Size */

const minSize = 100;
const maxSize = 600;
let currentSize;

const setSize = (size, store) => {
  if (size < minSize || size > maxSize) {
    return;
  }
  currentSize = size;
  textarea.style.fontSize = size + "%";
  if (store) {
    chrome.storage.local.set({ size: size });
  }
};

minus.addEventListener("click", () => {
  setSize(currentSize - 25, true);
});

plus.addEventListener("click", () => {
  setSize(currentSize + 25, true);
});


/* Page */

let savedNotes;

let currentNotes;
let currentIndex;

const setPage = (notes, index, store) => {
  if (index >= notes.length || index < 0) {
    index = 0;
  }
  currentIndex = index;
  page.innerText = (index + 1) + "/" + notes.length;
  textarea.value = notes[index];
  if (store) {
    chrome.storage.local.set({ index: index });
  }
};

page.addEventListener("click", function () {
  setPage(currentNotes, currentIndex + 1, true);
});

chrome.commands.onCommand.addListener(function(command) {
  if (command.startsWith("page-")) {
    const pageNumber = command.split("page-")[1];
    const newIndex = parseInt(pageNumber, 10) - 1;
    if (currentIndex === newIndex) {
      return;
    }
    currentIndex = newIndex;
    setPage(currentNotes, currentIndex, true);
    return;
  }

  if (command === "focus") {
    settings.classList.toggle("hide");
    return;
  }
});


/* Storage */

chrome.storage.local.get(["index", "font", "size", "mode"], local => {
  chrome.storage.sync.get(["notes"], sync => {
    savedNotes = sync.notes.slice();
    currentNotes = sync.notes.slice();
    currentIndex = local.index;

    setPage(currentNotes, currentIndex);
    setPlaceholder();
  });

  setFont(local.font.fontFamily);
  setSize(local.size);
  document.body.id = local.mode;
});


/* Typing */

const TAB = "  ";

function isTab(event) {
  return event.keyCode === 9 || event.which === 9 || event.key === "Tab";
}

function isShift(event) {
  return event.shiftKey;
}

function saveNotes() {
  let changed = false;
  for (let i = 0; i < savedNotes.length; i++) {
    if (savedNotes[i] !== currentNotes[i]) {
      changed = true;
      break;
    }
  }

  if (!changed) {
    return;
  }

  chrome.storage.sync.set({ notes: currentNotes }, function () {
    savedNotes = currentNotes.slice();
  });
}

let _saveNotesDebounce;
const saveNotesDebounce = function () {
  if (!_saveNotesDebounce) {
    chrome.runtime.getBackgroundPage(function (backgroundPage) {
      _saveNotesDebounce = backgroundPage.debounce(saveNotes, 1000);
      _saveNotesDebounce();
    });
  } else {
    _saveNotesDebounce();
  }
};

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
  if (currentNotes[currentIndex] === textarea.value) {
    return;
  }

  currentNotes[currentIndex] = textarea.value; // save notes locally
  setPlaceholder();
  saveNotesDebounce(); // save notes to the storage
});

window.addEventListener("beforeunload", saveNotes);

})(); // IIFE
