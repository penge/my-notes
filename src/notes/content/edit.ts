import { NotesObject } from "shared/storage/schema";
import { saveNotesDebounce } from "./save";

type NotesToSave = {
  [key: string]: {
    content: string
    modifiedTime: string
  }
}

let notesChangedByTimeout: number;

export default (active: string, content: string, tabId: string, notes: NotesObject): void => {
  if (!active || !tabId || !notes) {
    return;
  }

  // Different notes can be edited in different tabs/windows
  // 1. Collect the changes to "notesToSave"
  // 2. Use "saveNotesDebouce()" to save all the changes at once
  const notesToSave: NotesToSave = JSON.parse(localStorage.getItem("notesToSave") || "{}") || {};
  notesToSave[active] = {
    content,
    modifiedTime: new Date().toISOString(),
  };
  localStorage.setItem("notesToSave", JSON.stringify(notesToSave));
  clearTimeout(notesChangedByTimeout);
  localStorage.setItem("notesChangedBy", tabId);
  notesChangedByTimeout = window.setTimeout(() => localStorage.removeItem("notesChangedBy"), 2000);

  saveNotesDebounce(notes);
};
