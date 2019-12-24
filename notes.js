"use strict";

(function () {

/* global chrome, localStorage */

/* Elements */

const textarea = document.getElementById("textarea");
const settings = document.getElementById("settings");
const page = document.getElementById("page");
const fontSize = document.getElementById("font-size");


/* Font */

const setFont = (font) => {
  textarea.style.fontFamily = font;
};


/* Size */

const setSize = (size, store) => {
  textarea.style.fontSize = size + "%";
  if (fontSize.value != size) {
    fontSize.value = size;
  }
  if (store) {
    chrome.storage.local.set({ size: size });
  }
};

fontSize.oninput = function () { setSize(this.value); };
fontSize.onchange = function () { setSize(this.value, true); };


/* Page */

let currentNotes;
let currentIndex;

const mergeNotes = (currentNotes) => {
  const notesToSave = JSON.parse(localStorage.getItem('notesToSave'));
  if (!notesToSave) {
    return false;
  }
  const notes = currentNotes.map((value, index) =>
    typeof notesToSave[index] === "string" ? notesToSave[index] : value
  );
  return notes;
};

const setPage = (notes, index, store, update) => {
  if (currentIndex === index && !update) {
    return;
  }
  currentNotes = mergeNotes(notes) || notes;
  currentIndex = index;
  if (currentIndex >= currentNotes.length || currentIndex < 0) {
    currentIndex = 0;
  }
  page.innerText = (currentIndex + 1) + "/" + currentNotes.length;
  textarea.value = currentNotes[currentIndex];
  if (store) {
    chrome.storage.local.set({ index: currentIndex });
  }
};

page.addEventListener("click", () => {
  setPage(currentNotes, currentIndex + 1, true);
});

chrome.commands.onCommand.addListener(command => {
  if (command.startsWith("page-")) {
    const pageNumber = command.split("page-")[1];
    const index = parseInt(pageNumber, 10) - 1;
    setPage(currentNotes, index, true);
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
    setPage(sync.notes, local.index);
  });
  setFont(local.font.fontFamily);
  setSize(local.size);
  document.body.id = local.mode;
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    if (changes["mode"]) {
      const mode = changes["mode"].newValue;
      document.body.id = mode;
    }

    if (changes["font"]) {
      const font = changes["font"].newValue;
      setFont(font.fontFamily);
    }

    return;
  }

  if (areaName === "sync") {
    if (changes["notes"]) {
      const notes = changes["notes"].newValue;
      const needUpdate = notes.some((note, index) => currentNotes[index] !== note);
      if (needUpdate) {
        setPage(notes, currentIndex, false, true);
      }
    }

    return;
  }
});


/* Typing */

const TAB = "  ";

function isTab(event) {
  return event.keyCode === 9 || event.which === 9 || event.key === "Tab";
}

function isShift(event) {
  return event.shiftKey;
}

const saveNotes = (notes, flush) => {
  const notesToSave = mergeNotes(notes);
  if (!notesToSave) { return; }
  if (flush) { localStorage.removeItem('notesToSave'); }
  currentNotes = notesToSave;
  chrome.storage.sync.set({ notes: notesToSave });
};

let _saveNotesDebounce;
const saveNotesDebounce = function (notes) {
  if (!_saveNotesDebounce) {
    chrome.runtime.getBackgroundPage(function (backgroundPage) {
      _saveNotesDebounce = backgroundPage.debounce(saveNotes, 1000);
      _saveNotesDebounce(notes);
    });
  } else {
    _saveNotesDebounce(notes);
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

    if (start !== end) {
      return;
    }

    let before = textarea.value.substring(0, start);
    let after = textarea.value.substring(start);
    let movement = isShift(event) ? (TAB.length * -1) : TAB.length;
    let change = false;

    if (movement > 0) { // only TAB
      before = before + TAB;
      change = true;
    } else { // SHIFT + TAB
      for (let i = 1; i <= Math.abs(movement); i++) {
        if (before.endsWith(" ")) {
          before = before.substring(0, before.length - 1);
          change = true;
        } else {
          movement = (i - 1) * -1;
          break;
        }
      }
    }

    if (!change) {
      return;
    }

    textarea.value = before + after;
    textarea.selectionStart = start + movement;
    textarea.selectionEnd = end + movement;
  }

  // Do not save text if unchanged (Ctrl, Alt, Shift, Arrow keys)
  if (currentNotes[currentIndex] === textarea.value) {
    return;
  }

  let notesToSave = JSON.parse(localStorage.getItem('notesToSave')) || [];
  notesToSave[currentIndex] = textarea.value;
  localStorage.setItem("notesToSave", JSON.stringify(notesToSave));

  saveNotesDebounce(currentNotes);
});

window.addEventListener("beforeunload", () => {
  saveNotes(currentNotes, true);
});

})(); // IIFE
