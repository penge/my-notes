import { NotesObject } from "shared/storage/schema";

export default function renameNote(oldName: string, newName: string): void {
  if (!oldName || !newName || (oldName === newName)) {
    console.debug(`RENAME - Fail ("${oldName}" => "${newName}")`);
    return;
  }

  chrome.storage.local.get(["notes"], local => {
    const notes: NotesObject = { ...local.notes };

    // newName must be available
    if (newName in notes) {
      console.debug(`RENAME - Fail ("${newName}" is not available)`);
      return;
    }

    // oldName must be present
    if (!(oldName in notes)) {
      console.debug(`RENAME - Fail ("${oldName}" doesn't exist)`);
      return;
    }

    // Backup old note
    const note = notes[oldName];

    // Check if note is NOT locked
    if (note.locked) {
      console.debug(`RENAME - Fail ("${oldName}" is locked)`);
      return;
    }

    // Delete note with the old name
    delete notes[oldName];

    // Create a note under the new name
    notes[newName] = {
      ...note,
      modifiedTime: new Date().toISOString(),
    };

    chrome.storage.local.set({ notes }, () => {
      console.debug(`RENAME - OK ("${oldName}" => "${newName}")`);
    });
  });
}
