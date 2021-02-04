import { NotesObject } from "shared/storage/schema";
import debounce from "./debounce";

const mergeNotes = (currentNotes: NotesObject, notesToSave: NotesObject) => {
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
const saveNotes = (currentNotes: NotesObject): boolean => {
  const notesToSaveItem = localStorage.getItem("notesToSave");
  if (!notesToSaveItem) {
    return false;
  }

  const notesToSave: NotesObject = JSON.parse(notesToSaveItem);
  if (!notesToSave || typeof notesToSave !== "object") {
    return false; // no changes made or already saved
  }
  localStorage.removeItem("notesToSave");

  const notes = mergeNotes(currentNotes, notesToSave);
  chrome.storage.local.set({ notes: notes });
  return true;
};

// Saves notes after 1 second of inactivity
const saveNotesDebounce = debounce(saveNotes, 1000);

export {
  saveNotes,
  saveNotesDebounce,
};
