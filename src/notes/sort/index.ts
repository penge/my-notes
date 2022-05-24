import { SidebarNote } from "notes/adapters";
import { NotesOrder } from "shared/storage/schema";

export const sortNotes = (notes: SidebarNote[], notesOrder: NotesOrder, custom?: string[]): SidebarNote[] => {
  const pinnedNotes = notes.filter((note) => note.pinnedTime);
  const unpinnedNotes = notes.filter((note) => !note.pinnedTime);

  if (notesOrder === NotesOrder.Alphabetical) {
    const alphabeticalCompare = (a: SidebarNote, b: SidebarNote) => a.name.localeCompare(b.name);
    return [
      ...pinnedNotes.sort(alphabeticalCompare),
      ...unpinnedNotes.sort(alphabeticalCompare),
    ];
  }

  if (notesOrder === NotesOrder.NewestFirst) {
    const newestFirstCompare = (a: SidebarNote, b: SidebarNote) => -a.modifiedTime.localeCompare(b.modifiedTime);
    return [
      ...pinnedNotes.sort(newestFirstCompare),
      ...unpinnedNotes.sort(newestFirstCompare),
    ];
  }

  if (custom?.length) {
    const customCompare = (a: SidebarNote, b: SidebarNote) => custom.indexOf(a.name) - custom.indexOf(b.name);
    return [
      ...pinnedNotes.sort(customCompare),
      ...unpinnedNotes.sort(customCompare),
    ];
  }

  return [
    ...pinnedNotes,
    ...unpinnedNotes,
  ];
};
