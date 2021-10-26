import { readFile } from "./read-file";

const SUPPORTED_FILE_TYPES = [
  "text/plain",
  "text/html",
];

export const importNoteFromTxtFile = (file: File, callback: () => void): void => {
  if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
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
