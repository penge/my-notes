import { NotesObject, Note } from "shared/storage/schema";
import findFirstAvailableDuplicateName from "./helpers/find-first-available-duplicate-name";

export default function duplicateNote(noteNameToDuplicate: string): void {
  if (!noteNameToDuplicate) {
    return;
  }

  chrome.storage.local.get(["notes"], (local) => {
    const notes: NotesObject = { ...local.notes };

    if (!(noteNameToDuplicate in notes)) {
      console.debug(`DUPLICATE - Fail ("${noteNameToDuplicate}" doesn't exist)`);
      return;
    }

    const duplicateName = findFirstAvailableDuplicateName(Object.keys(notes), noteNameToDuplicate);
    const time = new Date().toISOString();
    // Without the file link of the original: the duplicate is a new note, and
    // sync uploads it as a file of its own instead of over the original's
    const { sync, ...original } = notes[noteNameToDuplicate];
    const duplicate: Note = {
      ...original,
      createdTime: time,
      modifiedTime: time,
    };

    notes[duplicateName] = duplicate;

    chrome.storage.local.set({ notes, active: duplicateName }, () => {
      console.debug(`DUPLICATE - OK "${duplicateName}"`);
    });
  });
}
