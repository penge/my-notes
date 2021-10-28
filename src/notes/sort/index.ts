import { SidebarNote } from "notes/adapters";
import { NotesOrder } from "shared/storage/schema";

export const sortNotes = (notes: SidebarNote[], notesOrder: NotesOrder, custom?: string[]): SidebarNote[] => {
  if (notesOrder === NotesOrder.Alphabetical) {
    return notes.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (notesOrder === NotesOrder.NewestFirst) {
    return notes.sort((a, b) => -a.modifiedTime.localeCompare(b.modifiedTime));
  }

  if (custom?.length) {
    return notes.sort((a, b) => custom.indexOf(a.name) - custom.indexOf(b.name));
  }

  return notes;
};
