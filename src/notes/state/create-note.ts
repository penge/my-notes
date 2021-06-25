import { NotesObject } from "shared/storage/schema";

export default function createNote(newNoteName: string): void {
  if (!newNoteName) {
    console.debug("CREATE - Fail (empty)");
    return;
  }

  chrome.storage.local.get(["notes"], local => {
    const notes: NotesObject = { ...local.notes };

    // Name must be available
    if (newNoteName in notes) {
      console.debug(`CREATE - Fail ("${newNoteName}" is not available)`);
      return;
    }

    const time = new Date().toISOString();

    // Set a new note
    notes[newNoteName] = {
      content: "",
      createdTime: time,
      modifiedTime: time,
    };

    chrome.storage.local.set({ notes, active: newNoteName }, () => {
      console.debug(`CREATE - OK "${newNoteName}"`);
    });
  });
}
