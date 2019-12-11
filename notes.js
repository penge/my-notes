"use strict";

(function () {

/* global chrome */

/* Elements */

const textarea = document.getElementById("textarea");
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
}


/* Size */

const minSize = 100;
const maxSize = 600;
let savedSize;
let currentSize;

const setSize = (size) => {
  textarea.style.fontSize = size + "%";
  currentSize = size;
};

const saveSize = (onlyKeys) => {
  if (currentSize === savedSize) {
    return;
  }

  if (onlyKeys) {
    return { size: currentSize };
  }

  chrome.storage.sync.set({ size: currentSize });
};

minus.addEventListener("click", function () {
  const size = currentSize - 25;
  if (size >= minSize) {
    setSize(size);
  }
});

plus.addEventListener("click", function () {
  const size = currentSize + 25;
  if (size <= maxSize) {
    setSize(size);
  }
});


/* Page */

let savedNotes;
let savedIndex;

let currentNotes;
let currentIndex;

const setPage = (notes, index) => {
  page.innerText = (index + 1) + "/" + notes.length;
  textarea.value = notes[index];
}

const saveIndex = (onlyKeys) => {
  if (currentIndex === savedIndex) {
    return;
  }

  if (onlyKeys) {
    return { index: currentIndex };
  }

  chrome.storage.sync.set({ index: currentIndex });
};

page.addEventListener("click", function () {
  currentIndex += 1;
  if (currentIndex === currentNotes.length) {
    currentIndex = 0;
  }
  setPage(currentNotes, currentIndex);
});

chrome.commands.onCommand.addListener(function(command) {
  if (command.startsWith("page-")) {
    const pageNumber = command.split("page-")[1];
    const newIndex = parseInt(pageNumber) - 1;
    if (currentIndex === newIndex) {
      return;
    }
    currentIndex = newIndex;
    setPage(currentNotes, currentIndex);
    return;
  }
});


/* Storage */

chrome.storage.sync.get(["notes", "index", "size", "font", "mode"], result => {
  savedNotes = result.notes.slice();
  savedIndex = result.index;
  savedSize = result.size;

  currentNotes = result.notes.slice();
  currentIndex = result.index;

  setFont(result.font.fontFamily);
  setSize(result.size);
  setPlaceholder();
  setPage(currentNotes, currentIndex);

  document.body.id = result.mode;
});


/* Typing */

const TAB = "  ";

function isTab(event) {
  return event.keyCode === 9 || event.which === 9 || event.key === "Tab";
}

function isShift(event) {
  return event.shiftKey;
}

function saveNotes(onlyKeys) {
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

  if (onlyKeys) {
    return { notes: currentNotes };
  }

  chrome.storage.sync.set({ notes: currentNotes }, function () {
    savedNotes = currentNotes.slice();
  });
}

const saveNotesDebounce = chrome.extension.getBackgroundPage().debounce(saveNotes, 1000, true);

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

  currentNotes[currentIndex] = textarea.value;
  setPlaceholder();
  saveNotesDebounce();
});

window.addEventListener("beforeunload", function () {
  const notes = saveNotes(true);
  const size = saveSize(true);
  const index = saveIndex(true);

  const keyValues = Object.assign({}, notes, size, index);
  if (Object.keys(keyValues).length > 0) {
    chrome.storage.sync.set(keyValues);
  }
});

})(); // IIFE
