import Log from "shared/log";
import { NotesObject, GoogleDriveFile } from "shared/storage/schema";

const getNoteNamesToDelete = (notes: NotesObject, remoteFiles: GoogleDriveFile[]): string[] => {
  const notesNamesToDelete = Object.keys(notes).filter((noteName) => {
    const note = notes[noteName];
    const fileId = note.sync?.file.id;
    const canDeleteNote = note.sync?.file.id // note was before synced to a file in Google Drive
      && note.sync?.file.modifiedTime === note.modifiedTime // note was NOT modified since the last sync
      && remoteFiles.find((file) => file.id === fileId) === undefined; // file in Google Drive is not found

    return canDeleteNote;
  });

  return notesNamesToDelete;
};

export default (notes: NotesObject, remoteFiles: GoogleDriveFile[]): NotesObject => {
  const notesCopy = { ...notes };
  getNoteNamesToDelete(notesCopy, remoteFiles).forEach((noteName) => {
    Log(`SYNC - IN - DELETING NOTE - ${noteName}`, "red");
    delete notesCopy[noteName];
  });

  // A note modified since the last sync is kept even though its file is
  // gone, and loses its link to that file, so push creates a new one
  const remoteFileIds = new Set(remoteFiles.map((file) => file.id));
  Object.keys(notesCopy).forEach((noteName) => {
    const { sync, ...note } = notesCopy[noteName];
    if (sync && !remoteFileIds.has(sync.file.id)) {
      Log(`SYNC - IN - UNLINKING NOTE - ${noteName}`, "red");
      notesCopy[noteName] = note;
    }
  });

  return notesCopy;
};
