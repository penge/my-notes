import { readFile } from "./read-file";

export const importNoteFromTxtFile = (file: File, callback: () => void): void => {
  if (!file.type.match("text/plain")) {
    callback();
    return;
  }

  const newNoteName = file.name.split(".").slice(0, -1).join("."); // remove file extension
  if (!newNoteName) {
    callback();
    return;
  }

  readFile(file, (newNote) => {
    chrome.storage.local.get("notes", local => {
      if (newNoteName in local.notes) {
        callback();
        return;
      }

      chrome.storage.local.set({
        notes: {
          ...local.notes,
          [newNoteName]: newNote,
        }
      }, callback);
    });
  });
};
