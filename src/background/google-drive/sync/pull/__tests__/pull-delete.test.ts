import { NotesObject, GoogleDriveFile } from "shared/storage/schema";
import { pullDelete } from "../pull-delete";

const notes: NotesObject = {
  // Do not delete Draft as it was modified since the last sync (even though the file in Google Drive was deleted)
  Draft: {
    content: "my draft",
    createdTime: "2021-04-04T09:40:00Z",
    modifiedTime: "2021-04-05T08:20:00Z", // modified since the last sync (on the next day)
    sync: {
      file: {
        id: "FILE-DRAFT",
        name: "Draft",
        createdTime: "2021-04-04T09:40:00Z",
        modifiedTime: "2021-04-04T09:55:00Z", // last sync is older than local modified time
      }
    }
  },

  // Do not delete Math as its file still exists (not modified since the last sync)
  Math: {
    content: "my math",
    createdTime: "2021-04-03T09:30:00Z",
    modifiedTime: "2021-04-04T15:50:00Z",
    sync: {
      file: {
        id: "FILE-MATH",
        name: "Math",
        createdTime: "2021-04-03T09:30:00Z",
        modifiedTime: "2021-04-04T15:50:00Z",
      }
    }
  },

  // News is safe to delete (its file was deleted from Google Drive, and the note was not modified since)
  News: {
    content: "my news",
    createdTime: "same-time",
    modifiedTime: "same-time",
    sync: {
      file: {
        id: "FILE-NEWS",
        name: "News",
        createdTime: "same-time",
        modifiedTime: "same-time",
      }
    }
  },

  // Do not delete Books as it is not synced yet
  Books: {
    content: "my calendar",
    createdTime: "not-relevant",
    modifiedTime: "not-relevant",
  },
};

const files: GoogleDriveFile[] = [
  {
    id: "FILE-MATH",
    name: "Math",
    createdTime: "2021-04-03T09:30:00Z",
    modifiedTime: "2021-04-04T15:50:00Z",
  }
];

test("pullDelete() deletes unchanged notes if their file was deleted", () => {
  const notesAfterPullDelete = pullDelete(notes, files);
  expect(notesAfterPullDelete).toEqual({
    Draft: notes["Draft"],
    Math: notes["Math"],
    // "News" deleted
    Books: notes["Books"],
  });
});
