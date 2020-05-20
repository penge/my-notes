/* global chrome */

import { isReserved } from "../reserved.js";

export default function createNote(name) {
  if (typeof name !== "string" || name.length === 0 || isReserved(name)) { // "Clipboard" is taken
    return;
  }

  chrome.storage.local.get(["notes"], local => {
    const notes = { ...local.notes };

    // Check if the name is unique
    if (name in notes) {
      return;
    }

    const time = new Date().toISOString();

    // Set a new note
    notes[name] = {
      content: "",
      createdTime: time,
      modifiedTime: time,
    };

    chrome.storage.local.set({ notes: notes });
  });
}
