/* global chrome, document, localStorage */

import debounce from "./debounce.js";

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
const saveNotes = (currentNotes) => {
  const notesToSave = JSON.parse(localStorage.getItem("notesToSave"));
  if (!notesToSave || typeof notesToSave !== "object") {
    return; // no changes made or already saved
  }
  localStorage.removeItem("notesToSave");

  const notes = mergeNotes(currentNotes, notesToSave);
  chrome.storage.local.set({ notes: notes });
};

// Saves notes after 1 second of inactivity
const saveNotesDebounce = debounce(saveNotes, 1000);

const syncNotes = (state) => {
  // Cannot Sync if already in progress
  const canSync = document.body.classList.contains("syncing") === false && typeof state.sync === "object";
  if (!canSync) {
    return;
  }

  document.body.classList.add("syncing");
  chrome.runtime.sendMessage({ type: "SYNC" });
};

export {
  saveNotes,
  saveNotesDebounce,
  syncNotes,
};
