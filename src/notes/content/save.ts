import { NotesObject } from "shared/storage/schema";

let notesChangedByTimeout: number;
const setChangedBy = (tabId: string) => {
  clearTimeout(notesChangedByTimeout);
  localStorage.setItem("notesChangedBy", tabId);
  notesChangedByTimeout = window.setTimeout(() => localStorage.removeItem("notesChangedBy"), 1000);
};

export const saveNote = (active: string, content: string, tabId: string, notes: NotesObject): void => {
  if (!active || !tabId || !notes) {
    return;
  }

  setChangedBy(tabId);
  const notesCopy: NotesObject = {
    ...notes,
    [active]: {
      ...notes[active],
      content,
      modifiedTime: new Date().toISOString(),
    },
  };

  chrome.storage.local.set({ notes: notesCopy });
};
