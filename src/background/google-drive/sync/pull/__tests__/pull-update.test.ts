import { NotesObject, GoogleDriveFile } from "shared/storage/schema";
import { GetFileFunction } from "background/google-drive/api";
import { pullUpdate } from "../pull-update";

const notes: NotesObject = {
  Books: {
    content: "my books",
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
  Music: {
    content: "my music",
    createdTime: "2021-04-07T10:00:00Z",
    modifiedTime: "2021-04-07T10:52:00Z", // updated since the last sync
    sync: {
      file: {
        id: "FILE-MUSIC",
        name: "Music",
        createdTime: "2021-04-07T10:00:00Z",
        modifiedTime: "2021-04-07T10:45:00Z",
      }
    }
  },
  Cooking: {
    content: "my cooking",
    createdTime: "2021-04-08T06:30:00Z",
    modifiedTime: "2021-04-08T13:05:00Z", // updated since the last sync
    sync: {
      file: {
        id: "FILE-591",
        name: "Cooking",
        createdTime: "2021-04-08T06:30:00Z",
        modifiedTime: "2021-04-08T06:50:00Z",
      }
    }
  }
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
    modifiedTime: "2021-04-08T08:30:00Z", // updated in Google Drive
  },
  {
    id: "FILE-123",
    name: "Gifts", // renamed in Google Drive
    createdTime: "2021-04-04T10:00:00Z",
    modifiedTime: "2021-04-07T19:00:00Z", // updated in Google Drive
  },
  {
    id: "FILE-MUSIC",
    name: "Music",
    createdTime: "2021-04-07T10:00:00Z",
    modifiedTime: "2021-04-07T14:30:00Z", // updated in Google Drive, but also locally after the last sync
  },
  {
    id: "FILE-591",
    name: "Recipes", // renamed in Google Drive
    createdTime: "2021-04-08T06:30:00Z",
    modifiedTime: "2021-04-08T09:25:00Z", // updated in Google Drive, but also locally after the last sync
  },
];

const getFile: GetFileFunction = (fileId: string) => Promise.resolve(`content from ${fileId}`);

test("pullUpdate() updates notes that had their files updated in Google Drive since the last sync", async () => {
  const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
  expect(notesAfterPullUpdate).toEqual({
    Books: notes["Books"], // unchanged
    Todo: {
      content: "content from FILE-TODO",
      createdTime: "2021-04-03T15:00:00Z",
      modifiedTime: "2021-04-08T08:30:00Z",
      sync: {
        file: {
          id: "FILE-TODO",
          name: "Todo",
          createdTime: "2021-04-03T15:00:00Z",
          modifiedTime: "2021-04-08T08:30:00Z",
        }
      }
    },
    Gifts: {
      content: "content from FILE-123",
      createdTime: "2021-04-04T10:00:00Z",
      modifiedTime: "2021-04-07T19:00:00Z",
      sync: {
        file: {
          id: "FILE-123",
          name: "Gifts",
          createdTime: "2021-04-04T10:00:00Z",
          modifiedTime: "2021-04-07T19:00:00Z",
        }
      }
    },
    Music: {
      content: "my music<br><br>content from FILE-MUSIC", // content merged
      createdTime: "2021-04-07T10:00:00Z",
      modifiedTime: "2021-04-07T14:30:00Z",
      sync: {
        file: {
          id: "FILE-MUSIC",
          name: "Music",
          createdTime: "2021-04-07T10:00:00Z",
          modifiedTime: "2021-04-07T14:30:00Z", // remote update was the latest
        }
      }
    },
    Cooking: notes["Cooking"], // modified in Google Drive, but also locally and that was the latest update (candidate for push)
  });
});
