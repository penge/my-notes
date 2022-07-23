import { NotesObject, GoogleDriveFile } from "shared/storage/schema";
import Log from "shared/log";
import { GetFileFunction } from "background/google-drive/api";

const getNewFiles = (notes: NotesObject, remoteFiles: GoogleDriveFile[]): GoogleDriveFile[] => {
  const existingNoteNames = Object.keys(notes);
  const syncedFileIds = Object.values(notes).map((note) => note.sync?.file.id);

  const newFiles = remoteFiles.filter((file) => {
    const isNewFile = !existingNoteNames.includes(file.name) // note with file's name does NOT exist (no conflict)
      && !syncedFileIds.includes(file.id); // file is NOT synced to any note

    return isNewFile;
  });

  return newFiles;
};

export default async (notes: NotesObject, remoteFiles: GoogleDriveFile[], getFile: GetFileFunction): Promise<NotesObject> => {
  const notesCopy = { ...notes };
  const newFiles = getNewFiles(notesCopy, remoteFiles);

  // eslint-disable-next-line no-restricted-syntax
  for await (const file of newFiles) {
    const fileContent = await getFile(file.id) || "";

    Log(`SYNC - IN - CREATING NOTE - ${file.name}`, "green");
    notesCopy[file.name] = {
      content: fileContent,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
      sync: { file },
    };
  }

  return notesCopy;
};
