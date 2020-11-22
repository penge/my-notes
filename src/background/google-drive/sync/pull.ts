import { Note, NotesObject, GoogleDriveFile } from "shared/storage/schema";
import { isReserved } from "../../../notes/reserved";

const LOG_LEVEL = process.env.LOG_LEVEL;
export const canLog = LOG_LEVEL !== "SILENT";

const noteFileId = (note: Note) => note.sync?.file.id;

interface PullOptions {
  getFile: (fileId: string) => Promise<string | undefined>
}

export default async (notes: NotesObject, files: GoogleDriveFile[], { getFile }: PullOptions): Promise<NotesObject> => {
  const updatedNotes = Object.assign({}, notes);

  // 1. Delete notes that have been deleted from other client (Google Drive, My Notes)
  //    COND: notes where note.sync.file.id is no longer in "files"
  const notesToDelete = Object.keys(updatedNotes).filter(noteName => {
    const note = updatedNotes[noteName];
    const fileId = noteFileId(note);
    const toDelete = fileId && files.find(file => file.id === fileId) === undefined;
    if (toDelete && isReserved(noteName)) {
      delete updatedNotes[noteName].sync;
      return false;
    }
    return toDelete;
  });
  notesToDelete.forEach(name => {
    canLog && console.log(`%cSYNC - IN - DELETING NOTE - ${name}`, "color: red");
    delete updatedNotes[name];
  });

  // 2. Create or update notes for every new or updated file
  //    COND: file.id is not present in any of note.sync.file.id OR
  //          file.modifiedTime > note.sync.file.modifiedTime, for the same file.id
  const mappedFiles = Object.keys(updatedNotes).filter(noteName => noteFileId(updatedNotes[noteName])).reduce((map: { [key: string]: { modifiedTime: string, noteName: string } }, noteName) => {
    const note = updatedNotes[noteName];
    const file = note.sync?.file;
    if (file) {
      map[file.id] = {
        modifiedTime: file.modifiedTime,
        noteName,
      };
    }
    return map;
  }, {}); // { file_id_1: { modifiedTime, noteName }, file_id_2: { modifiedTime, noteName }, ... }
  const filesToGet = files.filter(file =>
    !(file.id in mappedFiles) || // new file
    new Date(file.modifiedTime).getTime() > new Date(mappedFiles[file.id].modifiedTime).getTime() // updated file
  );
  for (const file of filesToGet) {
    const previousNoteName = (file.id in mappedFiles ? mappedFiles[file.id].noteName : undefined) || (file.name in updatedNotes ? file.name : undefined);
    if (previousNoteName && (previousNoteName !== file.name) && (isReserved(previousNoteName) || isReserved(file.name))) { // cannot rename "Clipboard", cannot rename to "Clipboard"
      canLog && console.log(`%cSYNC - IN - UNLINKING NOTE - ${previousNoteName} (cannot rename to ${file.name})`, "color: orange");
      delete updatedNotes[previousNoteName].sync; // unlink
      continue;
    }
    if (previousNoteName) {
      canLog && console.log(`%cSYNC - IN - UPDATING NOTE - ${file.name} (name before: ${previousNoteName})`, "color: blue");
    } else {
      canLog && console.log(`%cSYNC - IN - CREATING NOTE - ${file.name}`, "color: green");
    }
    const fileContent = (!previousNoteName || (updatedNotes[previousNoteName].modifiedTime !== file.modifiedTime)) && await getFile(file.id);
    const content: string = typeof fileContent === "string"
      ? (previousNoteName
        ? ("sync" in updatedNotes[previousNoteName] ? fileContent : updatedNotes[previousNoteName].content + "<br><br>" + fileContent)
        : fileContent)
      : typeof previousNoteName === "string" ? updatedNotes[previousNoteName].content : "";
    // Update the note, or create a new one
    updatedNotes[file.name] = {
      content: content,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
      sync: { file },
    };
    // Note was renamed, delete the old note
    if (previousNoteName && (previousNoteName !== file.name)) {
      delete updatedNotes[previousNoteName];
    }
  }

  return updatedNotes;
};
