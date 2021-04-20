import { NotesObject } from "shared/storage/schema";

export const saveNote = (active: string, content: string, tabId: string, notes: NotesObject): void => {
  if (!active || !tabId || !notes) {
    return;
  }

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
