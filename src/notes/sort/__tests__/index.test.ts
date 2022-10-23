import { SidebarNote } from "notes/adapters";
import { NotesOrder } from "shared/storage/schema";
import sortNotes from "..";

const notes: SidebarNote[] = [
  {
    name: "Clipboard",
    content: "my todo",
    createdTime: "CT-1",
    modifiedTime: "MT-4",
    pinnedTime: "PT-2",
  },
  {
    name: "Article",
    content: "my article",
    createdTime: "CT-4",
    modifiedTime: "MT-3",
  },
  {
    name: "Todo",
    content: "my todo",
    createdTime: "CT-2",
    modifiedTime: "MT-8",
    pinnedTime: "PT-1",
  },

  {
    name: "Shopping",
    content: "my shopping",
    createdTime: "CT-3",
    modifiedTime: "MT-7",
  },
];

const nameMap = (item: SidebarNote) => item.name;

test("sortNotes() sorts notes in Alphabetical order", () => {
  expect(
    sortNotes(notes, NotesOrder.Alphabetical).map(nameMap),
  ).toEqual([
    "Clipboard", "Todo",
    "Article", "Shopping",
  ]);
});

test("sortNotes() sorts notes in LatestCreated order", () => {
  expect(
    sortNotes(notes, NotesOrder.LatestCreated).map(nameMap),
  ).toEqual([
    "Todo", "Clipboard",
    "Article", "Shopping",
  ]);
});

test("sortNotes() sorts notes in LatestModified order", () => {
  expect(
    sortNotes(notes, NotesOrder.LatestModified).map(nameMap),
  ).toEqual([
    "Todo", "Clipboard",
    "Shopping", "Article",
  ]);
});

test("sortNotes() sorts notes in Custom order", () => {
  expect(
    sortNotes(notes, NotesOrder.Custom, ["Article", "Todo", "Clipboard", "Shopping"]).map(nameMap),
  ).toEqual([
    "Todo", "Clipboard",
    "Article", "Shopping",
  ]);
});

test("sortNotes() only groups by pinned and unpinned when no order is provided", () => {
  [undefined, []].forEach((order) => {
    expect(
      sortNotes(notes, NotesOrder.Custom, order).map(nameMap),
    ).toEqual([
      "Clipboard", "Todo",
      "Article", "Shopping",
    ]);
  });
});
