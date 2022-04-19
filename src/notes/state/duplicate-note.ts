import { NotesObject, Note } from "shared/storage/schema";
import { findFirstAvailableDuplicateName } from "./helpers";

export default function duplicateNote(noteNameToDuplicate: string): void {
  if (!noteNameToDuplicate) {
    return;
  }

  chrome.storage.local.get(["notes"], local => {
    const notes: NotesObject = { ...local.notes };

    if (!(noteNameToDuplicate in notes)) {
      console.debug(`DUPLICATE - Fail ("${noteNameToDuplicate}" doesn't exist)`);
      return;
    }

    const duplicateName = findFirstAvailableDuplicateName(Object.keys(notes), noteNameToDuplicate);
    const time = new Date().toISOString();
    const duplicate: Note = {
      ...notes[noteNameToDuplicate],
      createdTime: time,
      modifiedTime: time,
    };

    notes[duplicateName] = duplicate;

    chrome.storage.local.set({ notes, active: duplicateName }, () => {
      console.debug(`DUPLICATE - OK "${duplicateName}"`);
    });
  });
}
