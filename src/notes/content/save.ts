import { NotesObject, Note } from "shared/storage/schema";

const saveNoteCore = (noteName: string, tabId: string, notes: NotesObject, props: Partial<Note>) => {
  if (!noteName || !tabId || !notes) {
    return;
  }

  const notesCopy: NotesObject = {
    ...notes,
    [noteName]: {
      ...notes[noteName],
      ...props,
    },
  };

  chrome.storage.local.set({
    notes: notesCopy,
    ...(props.modifiedTime ? {
      setBy: `${tabId}-${props.modifiedTime}`,
      lastEdit: props.modifiedTime,
    } : {})
  });
};

export const saveNote = (noteName: string, content: string, tabId: string, notes: NotesObject): void => {
  saveNoteCore(noteName, tabId, notes, { content, modifiedTime: new Date().toISOString() });
};

export const setLocked = (noteName: string, locked: boolean, tabId: string, notes: NotesObject): void => {
  saveNoteCore(noteName, tabId, notes, { locked });
};
