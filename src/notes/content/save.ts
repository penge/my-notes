import { NotesObject } from "shared/storage/schema";

export const saveNote = (active: string, content: string, tabId: string, notes: NotesObject): void => {
  if (!active || !tabId || !notes) {
    return;
  }

  const modifiedTime = new Date().toISOString();

  const notesCopy: NotesObject = {
    ...notes,
    [active]: {
      ...notes[active],
      content,
      modifiedTime,
    },
  };

  chrome.storage.local.set({
    notes: notesCopy,
    setBy: `${tabId}-${modifiedTime}`,
    lastEdit: modifiedTime,
  });
};
