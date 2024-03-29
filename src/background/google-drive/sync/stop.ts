import { NotesObject } from "shared/storage/schema";
import { removePermission } from "shared/permissions";
import { removeItem, getItem, setItem } from "shared/storage";

// Unlinked notes are uploaded once Google Drive Sync is again enabled
export const unlinkNotes = (notes: NotesObject): NotesObject => {
  const unlinked = { ...notes };
  // eslint-disable-next-line no-restricted-syntax
  for (const noteName of Object.keys(unlinked)) {
    delete unlinked[noteName].sync;
  }
  return unlinked;
};

export default async (): Promise<boolean> => {
  await removePermission("identity");
  await removeItem("sync");

  const notes = await getItem<NotesObject>("notes");
  if (notes) {
    const unlinkedNotes = unlinkNotes(notes);
    await setItem("notes", unlinkedNotes);
  }

  return true;
};
