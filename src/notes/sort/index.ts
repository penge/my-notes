import { SidebarNote } from "notes/adapters";
import { NotesOrder } from "shared/storage/schema";

type CompareFn = (a: SidebarNote, b: SidebarNote) => number;
const sort = ({ pinnedNotes, unpinnedNotes, compareFn }: {
  pinnedNotes: SidebarNote[],
  unpinnedNotes: SidebarNote[],
  compareFn: CompareFn,
}) => [
  ...pinnedNotes.sort(compareFn),
  ...unpinnedNotes.sort(compareFn),
];

export default (notes: SidebarNote[], notesOrder: NotesOrder, custom?: string[]): SidebarNote[] => {
  const pinnedNotes = notes.filter((note) => note.pinnedTime);
  const unpinnedNotes = notes.filter((note) => !note.pinnedTime);

  if (notesOrder === NotesOrder.Alphabetical) {
    const alphabeticalCompare: CompareFn = (a, b) => a.name.localeCompare(b.name);
    return sort({ pinnedNotes, unpinnedNotes, compareFn: alphabeticalCompare });
  }

  if (notesOrder === NotesOrder.LatestCreated) {
    const latestCreatedCompare: CompareFn = (a, b) => -a.createdTime.localeCompare(b.createdTime);
    return sort({ pinnedNotes, unpinnedNotes, compareFn: latestCreatedCompare });
  }

  if (notesOrder === NotesOrder.LatestModified) {
    const latestModifiedCompare: CompareFn = (a, b) => -a.modifiedTime.localeCompare(b.modifiedTime);
    return sort({ pinnedNotes, unpinnedNotes, compareFn: latestModifiedCompare });
  }

  if (custom?.length) {
    const customCompare: CompareFn = (a, b) => custom.indexOf(a.name) - custom.indexOf(b.name);
    return sort({ pinnedNotes, unpinnedNotes, compareFn: customCompare });
  }

  return [
    ...pinnedNotes,
    ...unpinnedNotes,
  ];
};
