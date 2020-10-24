import { isReserved } from "../reserved";

export default function renameNote(rawOldName: string, rawNewName: string): void {
  const oldName = rawOldName.trim();
  const newName = rawNewName.trim();

  if (!oldName || !newName || (oldName === newName) || isReserved(oldName) || isReserved(newName)) { // cannot rename "Clipboard" || cannot rename to "Clipboard"
    console.debug(`RENAME - Fail ("${oldName}" => "${newName}")`);
    return;
  }

  chrome.storage.local.get(["notes"], local => {
    const notes = { ...local.notes };

    // newName must be available
    if (newName in notes) {
      console.debug(`RENAME - Fail ("${newName}" not available)`);
      return;
    }

    // oldName must be present
    if (!(oldName in notes)) {
      console.debug(`RENAME - Fail ("${oldName}" doesn't exist)`);
      return;
    }

    // Backup old note
    const note = notes[oldName];
    delete notes[oldName];

    // Create a note under the new name
    notes[newName] = {
      ...note,
      modifiedTime: new Date().toISOString(),
    };

    chrome.storage.local.set({ notes: notes }, () => {
      console.debug(`RENAME - OK ("${oldName}" => "${newName}")`);
    });
  });
}
