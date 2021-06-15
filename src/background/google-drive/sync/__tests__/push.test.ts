process.env.LOG_LEVEL = "SILENT";

import { CreateFileBodyOptions, UpdateFileBodyOptions } from "background/google-drive/bodies";
import push from "../push";

/*
UNCHANGED - File should remain unchanged if the note has "sync" and note.modifiedTime === note.sync.file.modifiedTime
NEW - Create a new file for every note without "sync", update "sync" with the created file
UPDATED - Update file name/content for every updated note (note with "sync", where note.modifiedTime > note.sync.file.modifiedTime), update "sync.file" after finished
*/
const notes = {
  Clipboard: { // UNCHANGED
    content: "Clipboard content",
    createdTime: "2020-04-20T09:07:00Z",
    modifiedTime: "2020-04-20T09:07:07Z",
    sync: {
      file: {
        id: "2931",
        name: "Clipboard",
        createdTime: "2020-04-20T09:07:00Z",
        modifiedTime: "2020-04-20T09:07:07Z",
      }
    }
  },

  Radio: { // NEW
    content: "some radio stations",
    createdTime: "2020-04-20T09:05:00Z",
    modifiedTime: "2020-04-20T09:05:05Z",
  },

  Todo: { // UPDATED
    content: "buy milk, buy coffee",
    createdTime: "2020-04-20T09:02:00Z",
    modifiedTime: "2020-04-20T09:02:07Z", // +5 seconds
    sync: {
      file: {
        id: "6073",
        name: "Todo",
        createdTime: "2020-04-20T09:02:00Z",
        modifiedTime: "2020-04-20T09:02:02Z",
      }
    }
  },

  Books: { // UNCHANGED
    content: "The Great Gatsby",
    createdTime: "2020-04-20T09:04:00Z",
    modifiedTime: "2020-04-20T09:04:04Z",
    sync: {
      file: {
        id: "9d13",
        name: "Books",
        createdTime: "2020-04-20T09:04:00Z",
        modifiedTime: "2020-04-20T09:04:04Z",
      }
    }
  },

  Amazon: { // UPDATED (also new name; name before - "Shopping")
    content: "things to buy, more things to buy",
    createdTime: "2020-04-20T09:06:00Z",
    modifiedTime: "2020-04-20T09:06:11Z", // +5 seconds
    sync: {
      file: {
        id: "df29",
        name: "Shopping",
        createdTime: "2020-04-20T09:06:00Z",
        modifiedTime: "2020-04-20T09:06:06Z",
      }
    }
  },

  Math: { // NEW
    content: "some equations",
    createdTime: "2020-04-20T09:09:00Z",
    modifiedTime: "2020-04-20T09:09:09Z",
  },
};

const createFile = (folderId: string, options: CreateFileBodyOptions) => Promise.resolve({ ...options, id: `${folderId}-${options.name}-created` });
const updateFile = (fileId: string, options: UpdateFileBodyOptions) => Promise.resolve({ ...options, id: `${fileId}-${options.name}-updated` });

it("pushes new and updated notes", async () => {
  const updatedNotes = await push("450e390a", notes, { createFile, updateFile });

  expect(Object.keys(updatedNotes).length).toBe(Object.keys(notes).length);

  // Clipboard (UNCHANGED)
  expect(updatedNotes.Clipboard.content).toBe("Clipboard content");
  expect(updatedNotes.Clipboard.createdTime).toBe("2020-04-20T09:07:00Z");
  expect(updatedNotes.Clipboard.modifiedTime).toBe("2020-04-20T09:07:07Z");
  expect(updatedNotes.Clipboard.sync?.file.id).toBe("2931");
  expect(updatedNotes.Clipboard.sync?.file.name).toBe("Clipboard");
  expect(updatedNotes.Clipboard.sync?.file.createdTime).toBe("2020-04-20T09:07:00Z");
  expect(updatedNotes.Clipboard.sync?.file.modifiedTime).toBe("2020-04-20T09:07:07Z");
  expect(Object.keys(updatedNotes.Clipboard.sync?.file || {}).length).toBe(4); // { id, name, createdTime, modifiedTime }

  // Radio (NEW)
  expect(updatedNotes.Radio.content).toBe("some radio stations");
  expect(updatedNotes.Radio.createdTime).toBe("2020-04-20T09:05:00Z");
  expect(updatedNotes.Radio.modifiedTime).toBe("2020-04-20T09:05:05Z");
  expect(updatedNotes.Radio.sync?.file.id).toBe("450e390a-Radio-created");
  expect(updatedNotes.Radio.sync?.file.name).toBe("Radio");
  expect(updatedNotes.Radio.sync?.file.createdTime).toBe("2020-04-20T09:05:00Z");
  expect(updatedNotes.Radio.sync?.file.modifiedTime).toBe("2020-04-20T09:05:05Z");
  expect(Object.keys(updatedNotes.Radio.sync?.file || {}).length).toBe(4); // { id, name, createdTime, modifiedTime }

  // Todo (UPDATED)
  expect(updatedNotes.Todo.content).toBe("buy milk, buy coffee");
  expect(updatedNotes.Todo.createdTime).toBe("2020-04-20T09:02:00Z");
  expect(updatedNotes.Todo.modifiedTime).toBe("2020-04-20T09:02:07Z");
  expect(updatedNotes.Todo.sync?.file.id).toBe("6073-Todo-updated");
  expect(updatedNotes.Todo.sync?.file.name).toBe("Todo");
  expect(updatedNotes.Todo.sync?.file.createdTime).toBe("2020-04-20T09:02:00Z");
  expect(updatedNotes.Todo.sync?.file.modifiedTime).toBe("2020-04-20T09:02:07Z");
  expect(Object.keys(updatedNotes.Todo.sync?.file || {}).length).toBe(4); // { id, name, createdTime, modifiedTime }

  // Books (UNCHANGED)
  expect(updatedNotes.Books.content).toBe("The Great Gatsby");
  expect(updatedNotes.Books.createdTime).toBe("2020-04-20T09:04:00Z");
  expect(updatedNotes.Books.modifiedTime).toBe("2020-04-20T09:04:04Z");
  expect(updatedNotes.Books.sync?.file.id).toBe("9d13");
  expect(updatedNotes.Books.sync?.file.name).toBe("Books");
  expect(updatedNotes.Books.sync?.file.createdTime).toBe("2020-04-20T09:04:00Z");
  expect(updatedNotes.Books.sync?.file.modifiedTime).toBe("2020-04-20T09:04:04Z");
  expect(Object.keys(updatedNotes.Books.sync?.file || {}).length).toBe(4); // { id, name, createdTime, modifiedTime }

  // Amazon (UPDATED, file.name before - "Shopping")
  expect(updatedNotes.Amazon.content).toBe("things to buy, more things to buy");
  expect(updatedNotes.Amazon.createdTime).toBe("2020-04-20T09:06:00Z");
  expect(updatedNotes.Amazon.modifiedTime).toBe("2020-04-20T09:06:11Z");
  expect(updatedNotes.Amazon.sync?.file.id).toBe("df29-Amazon-updated");
  expect(updatedNotes.Amazon.sync?.file.name).toBe("Amazon"); // before "Shopping"
  expect(updatedNotes.Amazon.sync?.file.createdTime).toBe("2020-04-20T09:06:00Z");
  expect(updatedNotes.Amazon.sync?.file.modifiedTime).toBe("2020-04-20T09:06:11Z");
  expect(Object.keys(updatedNotes.Amazon.sync?.file || {}).length).toBe(4); // { id, name, createdTime, modifiedTime }

  // Math (NEW)
  expect(updatedNotes.Math.content).toBe("some equations");
  expect(updatedNotes.Math.createdTime).toBe("2020-04-20T09:09:00Z");
  expect(updatedNotes.Math.modifiedTime).toBe("2020-04-20T09:09:09Z");
  expect(updatedNotes.Math.sync?.file.id).toBe("450e390a-Math-created");
  expect(updatedNotes.Math.sync?.file.name).toBe("Math");
  expect(updatedNotes.Math.sync?.file.createdTime).toBe("2020-04-20T09:09:00Z");
  expect(updatedNotes.Math.sync?.file.modifiedTime).toBe("2020-04-20T09:09:09Z");
  expect(Object.keys(updatedNotes.Math.sync?.file || {}).length).toBe(4); // { id, name, createdTime, modifiedTime }
});
