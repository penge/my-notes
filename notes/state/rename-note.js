/* global chrome */

import { isReserved } from "../reserved.js";

export default function renameNote(oldName, newName) {
  if ((oldName === newName) || isReserved(oldName) || isReserved(newName)) { // cannot rename "Clipboard" || cannot rename to "Clipboard"
    return;
  }

  chrome.storage.local.get(["notes"], local => {
    const notes = { ...local.notes };

    // Check if newName is unique, Check if oldName is present
    if (newName in notes || !(oldName in notes)) {
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

    chrome.storage.local.set({ notes: notes });
  });
}
