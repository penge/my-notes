"use strict";

(function () {

/* global chrome, localStorage */

/* Elements */

const textarea = document.getElementById("textarea");
const panel = document.getElementById("panel");
const options = document.getElementById("options");
const page = document.getElementById("page");


/* Font, Size, Mode, Focus */

const setFont = (font) => {
  document.body.style.fontFamily = font.fontFamily;
};

const setSize = (fontSize) => {
  document.body.style.fontSize = fontSize + "%";
};

const setMode = (mode) => {
  document.body.id = mode;
};

const setFocus = (focus) => {
  panel.classList.toggle("hide", focus);
};


/* Options */

options.addEventListener("click", (event) => {
  event.preventDefault();
  chrome.tabs.create({ url: "/options.html" });
});


/* Page */

let currentNotes;
let currentIndex;

const mergeNotes = (currentNotes) => {
  const notesToSave = JSON.parse(localStorage.getItem("notesToSave"));
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
  currentNotes = notes;
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

page.addEventListener("click", (event) => {
  event.preventDefault();
  setPage(currentNotes, currentIndex + 1, true);
});


/* Commands */

chrome.commands.onCommand.addListener(command => {
  // "page-1", "page-2", "page-3"
  if (command.startsWith("page-")) {
    const pageNumber = command.split("page-")[1];
    const index = parseInt(pageNumber, 10) - 1;
    setPage(currentNotes, index, true);
    return;
  }

  if (command === "focus") {
    chrome.storage.local.get(["focus"] , local => {
      chrome.storage.local.set({ focus: !local.focus });
    });
    return;
  }
});


/* Storage */

chrome.storage.local.get(["notes", "index", "font", "size", "mode", "focus"], local => {
  // No need to wait for "notes". Can set "font" and "size" upfront.
  setFont(local.font);
  setSize(local.size);
  setFocus(local.focus);

  setPage(local.notes, local.index); // Set "notes" first.
  setMode(local.mode);
  // Setting "mode" sets body opacity to 1.
  // Make sure to set "mode" after "notes" are set,
  // otherwise "Type your notes here." placeholder would
  // flicker on fast page refresh.
});

const apply = (change, applyHandler) => {
  if (change) {
    applyHandler(change.newValue);
  }
};

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    apply(changes["font"], setFont);
    apply(changes["size"], setSize);
    apply(changes["mode"], setMode);
    apply(changes["focus"], setFocus);

    if (changes["notes"]) {
      const notes = changes["notes"].newValue;
      const needUpdate = notes.some((note, index) => currentNotes[index] !== note);
      if (needUpdate) {
        // Except the current tab that saved the "currentNotes",
        // update "currentNotes" in every other My Notes tab.
        setPage(notes, currentIndex, false, true);
      }
    }
  }

  if (areaName === "sync") {
    if (changes["selection"]) {
      const selection = changes["selection"].newValue;
      if (!selection) { return; }
      chrome.storage.local.get(["token"], local => {
        if (selection.sender === local.token) { return; }
        const notes = [...currentNotes];
        notes[0] = selection.text + notes[0];
        chrome.storage.local.set({ notes: notes });
      });
    }
  }
});

const saveNotes = (notes) => {
  const notesToSave = mergeNotes(notes);

  // "notesToSave" are no longer in localStorage.
  if (!notesToSave) {
    return;
  }

  // When closing a window (all My Notes tabs),
  // first My Notes tab will save the changes,
  // and remove "notesToSave" from localStorage.
  //
  // This will save "notesToSave" just once, and
  // prevent other My Notes tabs to call the same
  // saving repeatedly.
  localStorage.removeItem("notesToSave");

  // "currentNotes" are updated before they are saved, so
  // listener updates ONLY other open My Notes Tabs/Windows
  currentNotes = notesToSave;
  chrome.storage.local.set({ notes: notesToSave });
};

let _saveNotesDebounce;

// "notes" are saved after 1 second of inactivity
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


/* Typing */

const TAB = "  ";

function isTab(event) {
  return event.keyCode === 9 || event.which === 9 || event.key === "Tab";
}

function isShift(event) {
  return event.shiftKey;
}

let typing = false;
textarea.addEventListener("keydown", (event) => {
  typing = true;
  if (isTab(event)) {
    event.preventDefault();
  }
});

textarea.addEventListener("keyup", (event) => {
  if (!typing) { return; } // Pressed Tab from browser's address bar
  typing = false;
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

  // Store most recent "notesToSave" to localStorage.
  // "notesToSave" can be set/updated by different My Notes tabs.
  // In other words, different My Notes tabs can edit different pages.
  // "notesToSave" is then used to save all the changes across all pages/tabs.
  let notesToSave = JSON.parse(localStorage.getItem("notesToSave")) || [];
  notesToSave[currentIndex] = textarea.value;
  localStorage.setItem("notesToSave", JSON.stringify(notesToSave));

  // Save "notes" (as a merge of "currentNotes" and "notesToSave")
  // to "chrome.storage.local".
  saveNotesDebounce(currentNotes);
});

// If the window is closed (before "saveNotesDebounce" is called),
// save the notes.
window.addEventListener("beforeunload", () => {
  // "saveNotes" might be called multiple times (multiple My Notes tabs were closed).
  // Before "notes" are saved, "notesToSave" will be removed from localStorage,
  // to prevent saving the same notes multiple times.
  saveNotes(currentNotes);
});

})(); // IIFE
