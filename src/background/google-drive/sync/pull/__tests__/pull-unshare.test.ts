import { Note, NotesObject } from "shared/storage/schema";
import pullUnshare from "../pull-unshare";

process.env.LOG_LEVEL = "SILENT";

const note = (content: string, createdTime: string, fileId?: string): Note => ({
  content,
  createdTime,
  modifiedTime: createdTime,
  ...(fileId ? {
    sync: {
      file: {
        id: fileId, name: "Groceries", createdTime, modifiedTime: createdTime,
      },
    },
  } : {}),
});

test("pullUnshare() keeps the file link on the original and unlinks its duplicates", () => {
  const notes: NotesObject = {
    "Groceries (2)": note("milk, eggs", "2020-04-20T10:00:00Z", "FILE-1"), // duplicated later
    Groceries: note("milk", "2020-04-20T09:00:00Z", "FILE-1"), // original
    "Groceries (3)": note("milk, bread", "2020-04-20T11:00:00Z", "FILE-1"), // duplicated later
    Recipes: note("pasta", "2020-04-20T08:00:00Z", "FILE-2"),
  };

  expect(pullUnshare(notes)).toEqual({
    Groceries: notes.Groceries,
    "Groceries (2)": note("milk, eggs", "2020-04-20T10:00:00Z"),
    "Groceries (3)": note("milk, bread", "2020-04-20T11:00:00Z"),
    Recipes: notes.Recipes,
  });
  expect(notes["Groceries (2)"].sync).toBeDefined(); // the notes passed in are not changed
});

test("pullUnshare() leaves notes with a file of their own unchanged", () => {
  const notes: NotesObject = {
    Groceries: note("milk", "2020-04-20T09:00:00Z", "FILE-1"),
    Recipes: note("pasta", "2020-04-20T08:00:00Z", "FILE-2"),
    Draft: note("ideas", "2020-04-20T07:00:00Z"),
  };

  expect(pullUnshare(notes)).toEqual(notes);
});
