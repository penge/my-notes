/* global chrome */

import { isReserved } from "../reserved.js";

export default function deleteNote(noteNameToDelete) {
  if (typeof noteNameToDelete !== "string" || noteNameToDelete.length === 0 || isReserved(noteNameToDelete)) { // cannot delete "Clipboard"
    return;
  }

  chrome.storage.local.get(["notes"], local => {
    const notes = { ...local.notes };

    // Check if the note exists
    if (!(noteNameToDelete in notes)) {
      return;
    }

    // Delete the note
    const deletedNote = notes[noteNameToDelete];
    delete notes[noteNameToDelete];

    chrome.storage.local.set({ notes: notes }, () => {
      const fileId = deletedNote.sync && deletedNote.sync.file && deletedNote.sync.file.id;
      if (fileId) {
        chrome.runtime.sendMessage({ type: "SYNC_DELETE_FILE", fileId });
      }
    });
  });
}
