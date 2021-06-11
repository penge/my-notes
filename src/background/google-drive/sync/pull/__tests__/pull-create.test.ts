import { NotesObject, GoogleDriveFile } from "shared/storage/schema";
import { GetFileFunction } from "background/google-drive/api";
import { pullCreate } from "../pull-create";

const notes: NotesObject = {
  // "Books" does NOT exist here (should be downloaded)

  Todo: {
    content: "my todo",
    createdTime: "2021-04-03T15:00:00Z",
    modifiedTime: "2021-04-03T15:10:00Z",
    sync: {
      file: {
        id: "FILE-TODO",
        name: "Todo",
        createdTime: "2021-04-03T15:00:00Z",
        modifiedTime: "2021-04-03T15:10:00Z",
      }
    }
  },

  // "Amazon" was named "Shopping" before
  Amazon: {
    content: "my amazon",
    createdTime: "2021-04-04T10:00:00Z",
    modifiedTime: "2021-04-04T10:30:00Z",
    sync: {
      file: {
        id: "FILE-123",
        name: "Amazon",
        createdTime: "2021-04-04T10:00:00Z",
        modifiedTime: "2021-04-04T10:30:00Z",
      }
    }
  },
};

const files: GoogleDriveFile[] = [
  {
    id: "FILE-BOOKS",
    name: "Books",
    createdTime: "2021-04-02T14:30:00Z",
    modifiedTime: "2021-04-02T14:45:00Z",
  },
  {
    id: "FILE-TODO",
    name: "Todo",
    createdTime: "2021-04-03T15:00:00Z",
    modifiedTime: "2021-04-03T15:10:00Z",
  },
  {
    id: "FILE-123",
    name: "Shopping", // renamed to "Amazon" locally
    createdTime: "2021-04-04T08:30:00Z",
    modifiedTime: "2021-04-03T08:40:00Z",
  },
];

const getFile: GetFileFunction = (fileId: string) => Promise.resolve(`content from ${fileId}`);

test("pullCreate() creates notes for every file where note with file's name does NOT exist and file is NOT synced to any existing note", async () => {
  const notesAfterPullCreate = await pullCreate(notes, files, getFile);
  expect(notesAfterPullCreate).toEqual({
    // "Books" should be downloaded (file is new, note did not exist)
    Books: {
      content: "content from FILE-BOOKS",
      createdTime: "2021-04-02T14:30:00Z",
      modifiedTime: "2021-04-02T14:45:00Z",
      sync: {
        file: {
          id: "FILE-BOOKS",
          name: "Books",
          createdTime: "2021-04-02T14:30:00Z",
          modifiedTime: "2021-04-02T14:45:00Z",
        }
      },
    },
    Todo: notes["Todo"], // "Todo" should be unchanged (file exists)
    Amazon: notes["Amazon"], // "Amazon" should be unchanged (file exists)
  });
});
