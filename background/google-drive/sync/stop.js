import { removePermission } from "../../../shared/permissions/index.js";
import { removeItem, getItem, setItem } from "../../../shared/storage/index.js";

// Unlinked notes are uploaded once Google Drive Sync is again enabled
export const unlinkNotes = (notes) => {
  const unlinked = { ...notes };
  for (const noteName of Object.keys(unlinked)) {
    delete unlinked[noteName].sync;
  }
  return unlinked;
};

export default async () => {
  await removePermission("identity");
  await removeItem("sync");

  const notes = await getItem("notes");
  const unlinkedNotes = unlinkNotes(notes);
  await setItem("notes", unlinkedNotes);

  return true;
};
