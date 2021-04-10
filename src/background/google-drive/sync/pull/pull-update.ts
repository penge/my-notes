import { NotesObject, GoogleDriveFile } from "shared/storage/schema";
import { Log } from "shared/logger";
import { GetFileFunction } from "background/google-drive/api";

const getFilesThatHaveBeenUpdated = (notes: NotesObject, remoteFiles: GoogleDriveFile[]): GoogleDriveFile[] => {
  const updatedFiles = remoteFiles.filter(file => {
    const syncedNote = Object.values(notes).find((note) => note.sync?.file.id === file.id);
    if (!syncedNote) {
      return false;
    }

    const isFileUpdated = new Date(syncedNote.modifiedTime).getTime() < new Date(file.modifiedTime).getTime();
    return isFileUpdated;
  });

  return updatedFiles;
};

export const pullUpdate = async (notes: NotesObject, remoteFiles: GoogleDriveFile[], getFile: GetFileFunction): Promise<NotesObject> => {
  const notesCopy = { ...notes };
  const updatedFiles = getFilesThatHaveBeenUpdated(notesCopy, remoteFiles);

  for (const file of updatedFiles) {
    const note = Object.values(notesCopy).find((note) => note.sync?.file.id === file.id);
    const previousNoteName = Object.keys(notesCopy).find((key) => notesCopy[key] === note);

    if (!note || !previousNoteName) {
      continue;
    }

    const fileContent = await getFile(file.id) || "";
    const newNoteContent = note.modifiedTime === note.sync?.file.modifiedTime
      ? fileContent
      : note.content + "<br><br>" + fileContent; // note was modified since last sync, merge content

    Log(`SYNC - IN - UPDATING NOTE - ${file.name} (name before: ${previousNoteName}, modified local/remote: ${note.modifiedTime}/${file.modifiedTime})`, "blue");

    notesCopy[file.name] = {
      content: newNoteContent,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
      sync: { file },
    };

    if (file.name !== previousNoteName) {
      delete notesCopy[previousNoteName];
    }
  }

  return notesCopy;
};
