import state from "./state/index";
import { saveNotesDebounce } from "./saving";

type NotesToSave = {
  [key: string]: {
    content: string
    modifiedTime: string
  }
}

let notesChangedByTimeout: number;

export default (content: HTMLElement, tabId: string): void => {
  if (!state.active) {
    return;
  }

  // Stop if the key didn't change the content
  // Example: Ctrl, Alt, Shift, Arrow keys
  if (state.notes[state.active].content === content.innerHTML) {
    return;
  }

  // Different notes can be edited in different tabs/windows
  // 1. Collect the changes to "notesToSave"
  // 2. Use "saveNotesDebouce()" to save all the changes at once
  const notesToSave: NotesToSave = JSON.parse(localStorage.getItem("notesToSave") || "{}") || {};
  notesToSave[state.active] = {
    content: content.innerHTML,
    modifiedTime: new Date().toISOString(),
  };
  localStorage.setItem("notesToSave", JSON.stringify(notesToSave));
  clearTimeout(notesChangedByTimeout);
  localStorage.setItem("notesChangedBy", tabId);
  notesChangedByTimeout = window.setTimeout(() => localStorage.removeItem("notesChangedBy"), 2000);

  saveNotesDebounce(state.notes);
};
