import sortNotes from "notes/sort";
import { NotesObject, Note, NotesOrder } from "shared/storage/schema";

export interface SidebarNote extends Note {
  name: string
}

export const notesToSidebarNotes = (
  notes: NotesObject,
  notesOrder: NotesOrder,
  custom?: string[],
): SidebarNote[] => {
  const unsorted = Object.keys(notes).map((noteName) => ({
    name: noteName,
    ...notes[noteName],
  }));

  return sortNotes(unsorted, notesOrder, custom);
};
