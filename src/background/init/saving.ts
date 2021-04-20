import {
  NotesObject,
  ContextMenuSelection,
  MessageType,
  Message,
} from "shared/storage/schema";

const getSetBy = (): string => `worker-${new Date().getTime()}`;

export const saveTextToLocalMyNotes = (textToSave: string, noteName: string): void => {
  chrome.storage.local.get(["notes"], local => {
    const notes = local.notes as NotesObject;

    const time = new Date().toISOString();

    notes[noteName] = noteName in notes ? {
      ...notes[noteName],
      content: textToSave + notes[noteName].content,
      modifiedTime: time,
    } : {
      content: textToSave,
      createdTime: time,
      modifiedTime: time,
    };

    chrome.storage.local.set({
      notes,
      setBy: getSetBy(),
    });
  });
};

export const saveTextToRemotelyOpenMyNotes = (textToSave: string): void => {
  chrome.storage.local.get(["id"], local => {
    if (!local.id) {
      return;
    }

    const selection: ContextMenuSelection = {
      text: textToSave,
      sender: local.id,
    };

    chrome.storage.sync.set({ selection });
  });
};

export const saveTextOnDrop = (): void => chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type !== MessageType.DROP) {
    return;
  }

  const { targetNoteName, data } = message.payload as { targetNoteName: string, data: string };
  if (!targetNoteName || !data) {
    return;
  }

  chrome.storage.local.get("notes", local => {
    const notes = local.notes as NotesObject;

    if (!(targetNoteName in notes)) {
      return;
    }

    const oldContent = notes[targetNoteName].content;
    const newContent = `${data}<br><br>${oldContent}`;
    const modifiedTime = new Date().toISOString();

    notes[targetNoteName] = {
      ...notes[targetNoteName],
      content: newContent,
      modifiedTime,
    };

    chrome.storage.local.set({
      notes,
      setBy: getSetBy(),
    });
  });
});
