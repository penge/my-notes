import { Log } from "shared/logger";
import { NotesObject, GoogleDriveFile } from "shared/storage/schema";

const getNoteNamesToDelete = (notes: NotesObject, remoteFiles: GoogleDriveFile[]): string[] => {
  const notesNamesToDelete = Object.keys(notes).filter(noteName => {
    const note = notes[noteName];
    const fileId = note.sync?.file.id;
    const canDeleteNote =
      note.sync?.file.id // note was before synced to a file in Google Drive
      && note.sync?.file.modifiedTime === note.modifiedTime // note was NOT modified since the last sync
      && remoteFiles.find(file => file.id === fileId) === undefined; // file in Google Drive is not found

    return canDeleteNote;
  });

  return notesNamesToDelete;
};

export const pullDelete = (notes: NotesObject, remoteFiles: GoogleDriveFile[]): NotesObject => {
  const notesCopy = { ...notes };
  getNoteNamesToDelete(notesCopy, remoteFiles).forEach(noteName => {
    Log(`SYNC - IN - DELETING NOTE - ${noteName}`, "red");
    delete notesCopy[noteName];
  });
  return notesCopy;
};
