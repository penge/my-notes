import { isReserved } from "../reserved";

export default function createNote(rawName: string): void {
  const name = rawName.trim();
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

    chrome.storage.local.set({ notes: notes, active: name }, () => {
      console.debug(`CREATE - OK "${name}"`);
    });
  });
}
