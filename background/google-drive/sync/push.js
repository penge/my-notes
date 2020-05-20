/* global console */

const merge = (note, file) => ({
  id: file.id,
  name: file.name,
  createdTime: file.createdTime || note.createdTime,
  modifiedTime: file.modifiedTime,
});

export default async (folderId, notes, files, { createFile, updateFile }) => {
  const updatedNotes = { ...notes };

  for (const noteName of Object.keys(updatedNotes)) {
    const note = updatedNotes[noteName];

    // 1. Create a file for every new note
    //    COND: note.sync is undefined
    if (!("sync" in note)) {
      console.log(`SYNC - OUT - CREATING FILE - ${noteName}`);
      const file = await createFile(folderId, { ...note, name: noteName }); // Returns { id, name, content, createdTime, modifiedTime }
      note.sync = { file: merge(note, file) };
      continue;
    }

    // 2. Update file for every updated note
    //    COND: note.modifiedTime > note.sync.file.modifiedTime
    if (new Date(note.modifiedTime).getTime() > new Date(note.sync.file.modifiedTime).getTime()) {
      console.log(`SYNC - OUT - UPDATING FILE - ${noteName} (name before: ${note.sync.file.name})`);
      const file = await updateFile(note.sync.file.id, { ...note, name: noteName }); // Returns { id, name, content, modifiedTime }
      note.sync = { file: merge(note, file) };
    }
  }

  return updatedNotes;
};
