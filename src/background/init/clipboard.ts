import {
  NotesObject,
  ContextMenuSelection,
} from "shared/storage/schema";

export const saveToClipboard = (textToSave: string): void => {
  chrome.storage.local.get(["notes", "clipboard"], local => {
    const notes = local.notes as NotesObject;
    const clipboard = local.clipboard as string | null;

    // clipboard note does exist
    if (clipboard && clipboard in notes) {
      notes[clipboard].content = textToSave + notes[clipboard].content;
      chrome.storage.local.set({ notes: notes });
      return;
    }

    // clipboard note does NOT exist (update existing "Clipboard" or create a new one)
    const time = new Date().toISOString();
    notes["Clipboard"] = "Clipboard" in notes ? {
      ...notes["Clipboard"],
      content: textToSave + notes["Clipboard"].content,
    } : {
      content: textToSave,
      createdTime: time,
      modifiedTime: time,
    };

    chrome.storage.local.set({ notes: notes, clipboard: "Clipboard" });
  });
};

export const saveToClipboardInOtherDevices = (textToSave: string): void => {
  chrome.storage.local.get(["id"], local => {
    if (!local.id) {
      return;
    }
    const selection: ContextMenuSelection = {
      text: textToSave,
      sender: local.id,
    };
    chrome.storage.sync.set({ selection: selection });
  });
};
