import { NotesObject, Note } from "shared/storage/schema";

const saveNoteCore = (noteName: string, tabId: string, notes: NotesObject, props: Partial<Note>) => {
  if (!noteName || !tabId || !notes) {
    return;
  }

  const modifiedTime = new Date().toISOString();

  const notesCopy: NotesObject = {
    ...notes,
    [noteName]: {
      ...notes[noteName],
      ...props,
      modifiedTime,
    },
  };

  chrome.storage.local.set({
    notes: notesCopy,
    setBy: `${tabId}-${modifiedTime}`,
    lastEdit: modifiedTime,
  });
};

export const saveNote = (noteName: string, content: string, tabId: string, notes: NotesObject): void => {
  saveNoteCore(noteName, tabId, notes, { content });
};

export const setLocked = (noteName: string, locked: boolean, tabId: string, notes: NotesObject): void => {
  saveNoteCore(noteName, tabId, notes, { locked });
};
