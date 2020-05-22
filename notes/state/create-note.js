/* global chrome, console */

import { isReserved } from "../reserved.js";

export default function createNote(rawName) {
  const name = typeof rawName === "string" && rawName.trim();
  if (!name || isReserved(name)) {
    console.debug("CREATE - Fail (empty or reserved)");
    return;
  }

  chrome.storage.local.get(["notes"], local => {
    const notes = { ...local.notes };

    // Name must be available
    if (name in notes) {
      console.debug(`CREATE - Fail ("${name}" not available)`);
      return;
    }

    const time = new Date().toISOString();

    // Set a new note
    notes[name] = {
      content: "",
      createdTime: time,
      modifiedTime: time,
    };

    chrome.storage.local.set({ notes: notes }, () => {
      console.debug(`CREATE - OK "${name}"`);
    });
  });
}
