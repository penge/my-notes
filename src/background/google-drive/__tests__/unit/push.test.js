/* global Promise, console */

import push from "../../sync/push.js";
import runTests from "../../../../tests/run-tests.js";

/*
UNCHANGED - File should remain unchanged if the note has "sync" and note.modifiedTime === note.sync.file.modifiedTime
NEW - Create a new file for every note without "sync", update "sync" with the created file
UPDATED - Update file name/content for every updated note (note with "sync", where note.modifiedTime > note.sync.file.modifiedTime), update "sync.file" after finished
*/
const notes = {
  Clipboard: { // UNCHANGED
    content: "Clipboard content",
    createdTime: "2020-04-20T09:07:00.000Z",
    modifiedTime: "2020-04-20T09:07:07.000Z",
    sync: {
      file: {
        id: "2931",
        name: "Clipboard",
        createdTime: "2020-04-20T09:07:00.000Z",
        modifiedTime: "2020-04-20T09:07:07.000Z",
      }
    }
  },

  Radio: { // NEW
    content: "some radio stations",
    createdTime: "2020-04-20T09:05:00.000Z",
    modifiedTime: "2020-04-20T09:05:05.000Z",
  },

  Todo: { // UPDATED
    content: "buy milk, buy coffee",
    createdTime: "2020-04-20T09:02:00.000Z",
    modifiedTime: "2020-04-20T09:02:07.000Z", // +5 seconds
    sync: {
      file: {
        id: "6073",
        name: "Todo",
        createdTime: "2020-04-20T09:02:00.000Z",
        modifiedTime: "2020-04-20T09:02:02.000Z",
      }
    }
  },

  Books: { // UNCHANGED
    content: "The Great Gatsby",
    createdTime: "2020-04-20T09:04:00.000Z",
    modifiedTime: "2020-04-20T09:04:04.000Z",
    sync: {
      file: {
        id: "9d13",
        name: "Books",
        createdTime: "2020-04-20T09:04:00.000Z",
        modifiedTime: "2020-04-20T09:04:04.000Z",
      }
    }
  },

  Amazon: { // UPDATED (also new name; name before - "Shopping")
    content: "things to buy, more things to buy",
    createdTime: "2020-04-20T09:06:00.000Z",
    modifiedTime: "2020-04-20T09:06:11.000Z", // +5 seconds
    sync: {
      file: {
        id: "df29",
        name: "Shopping",
        createdTime: "2020-04-20T09:06:00.000Z",
        modifiedTime: "2020-04-20T09:06:06.000Z",
      }
    }
  },

  Math: { // NEW
    content: "some equations",
    createdTime: "2020-04-20T09:09:00.000Z",
    modifiedTime: "2020-04-20T09:09:09.000Z",
  },
};

const files = [
  // UNCHANGED (same "modifiedTime")
  { id: "2931", name: "Clipboard", createdTime: "2020-04-20T09:07:00.000Z", modifiedTime: "2020-04-20T09:07:07.000Z" },
  { id: "9d13", name: "Books", createdTime: "2020-04-20T09:04:00.000Z", modifiedTime: "2020-04-20T09:04:04.000Z" },

  // UPDATED
  { id: "6073", name: "Todo", createdTime: "2020-04-20T09:02:00.000Z", modifiedTime: "2020-04-20T09:02:02.000Z" },
  { id: "df29", name: "Shopping", createdTime: "2020-04-20T09:06:00.000Z", modifiedTime: "2020-04-20T09:06:06.000Z" }, // renamed to "Amazon"

  // NEW
  // "Radio"
  // "Math"
];

const createFile = (folderId, file) => Promise.resolve({ ...file, id: `${folderId}-${file.name}` });
const updateFile = (fileId, file) => Promise.resolve({ ...file, id: fileId });

const test = async () => {
  const updatedNotes = await push("450e390a", notes, files, { createFile, updateFile });

  console.assert(updatedNotes.length === notes.length);

  // Clipboard (UNCHANGED)
  console.assert(updatedNotes.Clipboard.content === "Clipboard content");
  console.assert(updatedNotes.Clipboard.createdTime === "2020-04-20T09:07:00.000Z");
  console.assert(updatedNotes.Clipboard.modifiedTime === "2020-04-20T09:07:07.000Z");
  console.assert(updatedNotes.Clipboard.sync.file.id === "2931");
  console.assert(updatedNotes.Clipboard.sync.file.name === "Clipboard");
  console.assert(updatedNotes.Clipboard.sync.file.createdTime === "2020-04-20T09:07:00.000Z");
  console.assert(updatedNotes.Clipboard.sync.file.modifiedTime === "2020-04-20T09:07:07.000Z");
  console.assert(Object.keys(updatedNotes.Clipboard.sync.file).length === 4); // { id, name, createdTime, modifiedTime }

  // Radio (NEW)
  console.assert(updatedNotes.Radio.content === "some radio stations");
  console.assert(updatedNotes.Radio.createdTime === "2020-04-20T09:05:00.000Z");
  console.assert(updatedNotes.Radio.modifiedTime === "2020-04-20T09:05:05.000Z");
  console.assert(updatedNotes.Radio.sync.file.id === "450e390a-Radio");
  console.assert(updatedNotes.Radio.sync.file.name === "Radio");
  console.assert(updatedNotes.Radio.sync.file.createdTime === "2020-04-20T09:05:00.000Z");
  console.assert(updatedNotes.Radio.sync.file.modifiedTime === "2020-04-20T09:05:05.000Z");
  console.assert(Object.keys(updatedNotes.Radio.sync.file).length === 4); // { id, name, createdTime, modifiedTime }

  // Todo (UPDATED)
  console.assert(updatedNotes.Todo.content === "buy milk, buy coffee");
  console.assert(updatedNotes.Todo.createdTime === "2020-04-20T09:02:00.000Z");
  console.assert(updatedNotes.Todo.modifiedTime === "2020-04-20T09:02:07.000Z");
  console.assert(updatedNotes.Todo.sync.file.id === "6073");
  console.assert(updatedNotes.Todo.sync.file.name === "Todo");
  console.assert(updatedNotes.Todo.sync.file.createdTime === "2020-04-20T09:02:00.000Z");
  console.assert(updatedNotes.Todo.sync.file.modifiedTime === "2020-04-20T09:02:07.000Z");
  console.assert(Object.keys(updatedNotes.Todo.sync.file).length === 4); // { id, name, createdTime, modifiedTime }

  // Books (UNCHANGED)
  console.assert(updatedNotes.Books.content === "The Great Gatsby");
  console.assert(updatedNotes.Books.createdTime === "2020-04-20T09:04:00.000Z");
  console.assert(updatedNotes.Books.modifiedTime === "2020-04-20T09:04:04.000Z");
  console.assert(updatedNotes.Books.sync.file.id === "9d13");
  console.assert(updatedNotes.Books.sync.file.name === "Books");
  console.assert(updatedNotes.Books.sync.file.createdTime === "2020-04-20T09:04:00.000Z");
  console.assert(updatedNotes.Books.sync.file.modifiedTime === "2020-04-20T09:04:04.000Z");
  console.assert(Object.keys(updatedNotes.Books.sync.file).length === 4); // { id, name, createdTime, modifiedTime }

  // Amazon (UPDATED, file.name before - "Shopping")
  console.assert(updatedNotes.Amazon.content === "things to buy, more things to buy");
  console.assert(updatedNotes.Amazon.createdTime === "2020-04-20T09:06:00.000Z");
  console.assert(updatedNotes.Amazon.modifiedTime === "2020-04-20T09:06:11.000Z");
  console.assert(updatedNotes.Amazon.sync.file.id === "df29");
  console.assert(updatedNotes.Amazon.sync.file.name === "Amazon"); // before "Shopping"
  console.assert(updatedNotes.Amazon.sync.file.createdTime === "2020-04-20T09:06:00.000Z");
  console.assert(updatedNotes.Amazon.sync.file.modifiedTime === "2020-04-20T09:06:11.000Z");
  console.assert(Object.keys(updatedNotes.Amazon.sync.file).length === 4); // { id, name, createdTime, modifiedTime }

  // Math (NEW)
  console.assert(updatedNotes.Math.content === "some equations");
  console.assert(updatedNotes.Math.createdTime === "2020-04-20T09:09:00.000Z");
  console.assert(updatedNotes.Math.modifiedTime === "2020-04-20T09:09:09.000Z");
  console.assert(updatedNotes.Math.sync.file.id === "450e390a-Math");
  console.assert(updatedNotes.Math.sync.file.name === "Math");
  console.assert(updatedNotes.Math.sync.file.createdTime === "2020-04-20T09:09:00.000Z");
  console.assert(updatedNotes.Math.sync.file.modifiedTime === "2020-04-20T09:09:09.000Z");
  console.assert(Object.keys(updatedNotes.Math.sync.file).length === 4); // { id, name, createdTime, modifiedTime }
};

runTests("background/google-drive/__tests__/unit/push.test.js", [
  test,
]);
