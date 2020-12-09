import { MessageType } from "shared/storage/schema";
import { sendMessage } from "messages/index";

export default function deleteNote(noteNameToDelete: string): void {
  if (!noteNameToDelete) {
    return;
  }

  chrome.storage.local.get(["notes", "clipboard"], local => {
    const notes = { ...local.notes };

    // Check if the note exists
    if (!(noteNameToDelete in notes)) {
      return;
    }

    // Delete the note
    const deletedNote = notes[noteNameToDelete];
    delete notes[noteNameToDelete];

    // New clipboard
    const clipboard = local.clipboard === noteNameToDelete ? null : local.clipboard;

    chrome.storage.local.set({ notes, clipboard }, () => {
      const fileId = deletedNote.sync && deletedNote.sync.file && deletedNote.sync.file.id;
      if (fileId) {
        sendMessage(MessageType.SYNC_DELETE_FILE, fileId);
      }
    });
  });
}
