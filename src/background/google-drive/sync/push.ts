import { Note, NotesObject, GoogleDriveFile } from "shared/storage/schema";
import { Log } from "shared/logger";
import { GoogleDriveFileUpdate } from "../api";
import { CreateFileBodyOptions, UpdateFileBodyOptions } from "../bodies";

const merge = (note: Note, file: GoogleDriveFile | GoogleDriveFileUpdate): GoogleDriveFile => ({
  id: file.id,
  name: file.name,
  createdTime: (file as GoogleDriveFile).createdTime || note.createdTime,
  modifiedTime: file.modifiedTime,
});

interface PushOptions {
  createFile: (folderId: string, options: CreateFileBodyOptions) => Promise<GoogleDriveFile>
  updateFile: (fileId: string, options: UpdateFileBodyOptions) => Promise<GoogleDriveFileUpdate>
}

export default async (folderId: string, notes: NotesObject, { createFile, updateFile }: PushOptions): Promise<NotesObject> => {
  const updatedNotes = { ...notes };

  for (const noteName of Object.keys(updatedNotes)) {
    const note = updatedNotes[noteName];

    // 1. Create a file for every new note
    //    COND: note.sync is undefined
    if (!note.sync) {
      Log(`SYNC - OUT - CREATING FILE - ${noteName}`);
      const file = await createFile(folderId, { ...note, name: noteName }); // Returns { id, name, content, createdTime, modifiedTime }
      note.sync = { file: merge(note, file) };
      continue;
    }

    // 2. Update file for every updated note
    //    COND: note.modifiedTime > note.sync.file.modifiedTime
    if (note.modifiedTime > note.sync.file.modifiedTime) {
      Log(`SYNC - OUT - UPDATING FILE - ${noteName} (name before: ${note.sync.file.name})`);
      const file = await updateFile(note.sync.file.id, { ...note, name: noteName }); // Returns { id, name, content, modifiedTime }
      note.sync = { file: merge(note, file) };
    }
  }

  return updatedNotes;
};
