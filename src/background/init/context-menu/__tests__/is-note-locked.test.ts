import { NotesObject, Note } from "shared/storage/schema";
import isNoteLocked from "../is-note-locked";

const dummyNote: Note = {
  content: "",
  createdTime: "",
  modifiedTime: "",
};

const notes: NotesObject = {
  "@clipboard": { ...dummyNote, locked: false },
  "@images": { ...dummyNote, locked: true },
  Todo: { ...dummyNote, locked: undefined },
};

test("isNoteLocked()", () => {
  expect(isNoteLocked(notes, "@clipboard")).toBe(false);
  expect(isNoteLocked(notes, "@images")).toBe(true);
  expect(isNoteLocked(notes, "Todo")).toBe(false);
});
