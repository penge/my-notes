import { SidebarNote } from "notes/adapters";
import { NotesOrder } from "shared/storage/schema";
import { sortNotes } from "..";

const notes: SidebarNote[] = [
  {
    name: "Clipboard",
    content: "my todo",
    createdTime: "CT1",
    modifiedTime: "MT4",
  },
  {
    name: "Todo",
    content: "my todo",
    createdTime: "CT2",
    modifiedTime: "MT8",
  },
  {
    name: "Article",
    content: "my article",
    createdTime: "CT4",
    modifiedTime: "MT3",
  },
  {
    name: "Shopping",
    content: "my shopping",
    createdTime: "CT3",
    modifiedTime: "MT7",
  },
];

const nameMap = (item: SidebarNote) => item.name;

test("sortNotes() sorts notes in Alphabetical order", () => {
  expect(
    sortNotes(notes, NotesOrder.Alphabetical).map(nameMap)
  ).toEqual(["Article", "Clipboard", "Shopping", "Todo"]);
});

test("sortNotes() sorts notes in NewestFirst order", () => {
  expect(
    sortNotes(notes, NotesOrder.NewestFirst).map(nameMap)
  ).toEqual(["Todo", "Shopping", "Clipboard", "Article"]);
});

test("sortNotes() sorts notes in Custom order", () => {
  const custom = ["Article", "Todo", "Clipboard", "Shopping"];
  expect(
    sortNotes(notes, NotesOrder.Custom, custom).map(nameMap)
  ).toEqual(custom);
});

test("sortNotes() returns original order when custom order is not provided", () => {
  const original = notes.map(nameMap);

  expect(
    sortNotes(notes, NotesOrder.Custom).map(nameMap) // "custom" is not provided
  ).toEqual(original);

  expect(
    sortNotes(notes, NotesOrder.Custom, []).map(nameMap) // "custom" is empty
  ).toEqual(original);
});
