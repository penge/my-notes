/* global chrome, localStorage */

import debounce from "./debounce.js";
import call from "../background/google-drive/call.js";

const mergeNotes = (currentNotes, notesToSave) => {
  const notes = Object.assign({}, currentNotes);

  // Update notes with changes in notesToSave
  for (const noteName of Object.keys(notes)) {
    if (noteName in notesToSave) {
      // every note => { content, createdTime, modifiedTime }
      notes[noteName].content = notesToSave[noteName].content;
      notes[noteName].modifiedTime = notesToSave[noteName].modifiedTime;
    }
  }

  return notes;
};

// Can be called multiple times when multiple My Notes tabs/windows are closed
// Make sure the actual saving is run only once
// All changes across tabs/windows are in "notesToSave"
const saveNotes = (currentNotes, callback) => {
  const notesToSave = JSON.parse(localStorage.getItem("notesToSave"));
  if (!notesToSave || typeof notesToSave !== "object") {
    if (callback) { callback(); }
    return; // no changes made or already saved
  }
  localStorage.removeItem("notesToSave");

  const notes = mergeNotes(currentNotes, notesToSave);
  chrome.storage.local.set({ notes: notes }, () => {
    if (callback) { callback(); }
  });
};

// Saves notes after 1 second of inactivity
const saveNotesDebounce = debounce(saveNotes, 1000);

const syncNotes = (force) => {
  const changed = localStorage.getItem("notesChangedBy");
  if (changed || force) {
    localStorage.removeItem("notesChangedBy");
    chrome.runtime.sendMessage({ type: "SYNC" });
  }
};

const saveLastActive = () => {
  const lastActive = localStorage.getItem("lastActive");
  if (lastActive === undefined) {
    return;
  }
  localStorage.removeItem("lastActive");
  chrome.storage.local.set({ active: lastActive });
};

export {
  saveNotes,
  saveNotesDebounce,
  syncNotes,

  saveLastActive,
};
