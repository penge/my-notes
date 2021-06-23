import { NotesObject, Note, MessageType } from "shared/storage/schema";
import { sendMessage } from "messages/index";

export default function deleteNote(noteNameToDelete: string): void {
  if (!noteNameToDelete) {
    return;
  }

  chrome.storage.local.get(["notes"], local => {
    const notes: NotesObject = { ...local.notes };

    // Check if note exists
    if (!(noteNameToDelete in notes)) {
      console.debug(`DELETE - Fail ("${noteNameToDelete}" doesn't exist)`);
      return;
    }

    const noteToDelete: Note = notes[noteNameToDelete];

    // Check if note is NOT locked
    if (noteToDelete.locked) {
      console.debug(`DELETE - Fail ("${noteNameToDelete}" is locked)`);
      return;
    }

    // Delete note
    delete notes[noteNameToDelete];

    chrome.storage.local.set({ notes }, () => {
      console.debug(`DELETE - OK "${noteNameToDelete}"`);

      const fileId = noteToDelete.sync?.file.id;
      if (fileId) {
        sendMessage(MessageType.SYNC_DELETE_FILE, fileId);
      }
    });
  });
}
