/* global localStorage */

import state from "./state/index.js";
import { saveNotesDebounce } from "./saving.js";

export default (content, tabId) => {
  // Stop if the key didn't change the content
  // Example: Ctrl, Alt, Shift, Arrow keys
  if (state.notes[state.active].content === content.innerHTML) {
    return;
  }

  // Different notes can be edited in different tabs/windows
  // 1. Collect the changes to "notesToSave"
  // 2. Use "saveNotesDebouce()" to save all the changes at once
  let notesToSave = JSON.parse(localStorage.getItem("notesToSave")) || {};
  notesToSave[state.active] = {
    content: content.innerHTML,
    modifiedTime: new Date().toISOString(),
  };
  localStorage.setItem("notesToSave", JSON.stringify(notesToSave));
  localStorage.setItem("notesChangedBy", tabId);

  saveNotesDebounce(state.notes);
};
