import { NotesObject, Note, GoogleDriveFile } from "shared/storage/schema";
import { Log } from "shared/logger";
import { GetFileFunction } from "background/google-drive/api";

const prepareNote = (content: string, file: GoogleDriveFile): Note => ({
  content,
  createdTime: file.createdTime,
  modifiedTime: file.modifiedTime,
  sync: {
    file: {
      id: file.id,
      name: file.name,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
    }
  }
});

const mergeContent = (noteContent: string, fileContent: string) => noteContent + "<br><br>" + fileContent;

const updateNote = async (
  notes: NotesObject,
  syncedNote: Note,
  file: GoogleDriveFile,
  getFile: GetFileFunction,
  contentResolution: "replace" | "merge"
) => {
  const notesCopy: NotesObject = { ...notes };

  const previousNoteName = Object.keys(notesCopy).find((key) => notesCopy[key] === syncedNote);
  const fileContent = await getFile(file.id) || "";

  Log(`SYNC - IN - UPDATING NOTE - ${file.name} (name before: ${previousNoteName || file.name}, note MT: ${syncedNote.modifiedTime}, file MT: ${file.modifiedTime})`, "blue");
  notesCopy[file.name] = prepareNote(
    contentResolution === "replace" ? fileContent : mergeContent(syncedNote.content, fileContent),
    file,
  );

  if (previousNoteName && previousNoteName !== file.name) {
    delete notesCopy[previousNoteName];
  }

  return notesCopy;
};

export const pullUpdate = async (notes: NotesObject, remoteFiles: GoogleDriveFile[], getFile: GetFileFunction): Promise<NotesObject> => {
  let notesCopy: NotesObject = { ...notes };

  for (const file of remoteFiles) {
    const syncedNote = Object.values(notes).find((note) => note.sync?.file.id === file.id);

    if (
      syncedNote && syncedNote.sync // note is synced
      && syncedNote.modifiedTime === syncedNote.sync.file.modifiedTime // note is NOT modified since the last sync
      && file.modifiedTime > syncedNote.modifiedTime // file is modified since the last sync
    ) {
      notesCopy = await updateNote(notesCopy, syncedNote, file, getFile, "replace");
    }

    if (
      syncedNote && syncedNote.sync // note is synced
      && syncedNote.modifiedTime !== syncedNote.sync.file.modifiedTime // note is modified since the last sync
      && file.modifiedTime > syncedNote.modifiedTime // file is modified since the last sync, file is the latest update
    ) {
      notesCopy = await updateNote(notesCopy, syncedNote, file, getFile, "merge");
    }

    if (
      !syncedNote && file.name in notesCopy // note is NOT synced
      && notesCopy[file.name].modifiedTime === file.modifiedTime // note and file have the same modified time
    ) {
      Log(`SYNC - IN - CONNECTING NOTE - ${file.name} (note MT: ${notesCopy[file.name].modifiedTime}, file MT: ${file.modifiedTime})`, "blue");
      notesCopy[file.name] = prepareNote(notesCopy[file.name].content, file);
    }

    if (
      !syncedNote && file.name in notesCopy // note is NOT synced
      && notesCopy[file.name].modifiedTime !== file.modifiedTime // note and file do NOT have the same modified time
    ) {
      const fileContent = await getFile(file.id) || "";
      Log(`SYNC - IN - UPDATING NOTE - ${file.name} (note MT: ${notesCopy[file.name].modifiedTime}, file MT: ${file.modifiedTime})`, "blue");
      notesCopy[file.name] = prepareNote(
        mergeContent(notesCopy[file.name].content, fileContent),
        file,
      );
    }
  }

  return notesCopy;
};
