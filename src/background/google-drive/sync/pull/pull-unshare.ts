import Log from "shared/log";
import { NotesObject } from "shared/storage/schema";

// Notes duplicated before duplicates dropped their file link share one file
// with the original, so each sync wrote one of them over the other. The
// original, created first, keeps the link; every other note holding the same
// file is unlinked, so push creates a file of its own for it
export default (notes: NotesObject): NotesObject => {
  const notesCopy = { ...notes };

  const byCreated = Object.keys(notesCopy)
    .sort((a, b) => notesCopy[a].createdTime.localeCompare(notesCopy[b].createdTime));

  const held = new Set<string>();
  byCreated.forEach((noteName) => {
    const { sync, ...note } = notesCopy[noteName];
    if (!sync) {
      return;
    }

    if (!held.has(sync.file.id)) {
      held.add(sync.file.id);
      return;
    }

    Log(`SYNC - IN - UNLINKING DUPLICATE - ${noteName}`, "red");
    notesCopy[noteName] = note;
  });

  return notesCopy;
};
