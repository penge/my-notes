import { NotesObject, GoogleDriveFile } from "shared/storage/schema";
import { UpdateFileBodyOptions } from "background/google-drive/bodies";
import pull from "../pull";
import push from "../push";

process.env.LOG_LEVEL = "SILENT";

// The steps of a sync run in order with the real pull and push, as `syncNotes`
// runs them, with Google Drive replaced by stubs and without storage
describe("sync steps with the real pull and push", () => {
  const getFile = async (id: string) => `content of ${id}`;

  test("a merged note is uploaded by push in the same sync", async () => {
    const notes: NotesObject = {
      Books: {
        content: "my books, edited",
        createdTime: "2020-04-20T08:00:00.000Z",
        modifiedTime: "2020-04-20T09:04:00.000Z", // edited here since the last sync
        sync: {
          file: {
            id: "FILE-1", name: "Books", createdTime: "2020-04-20T08:00:00.000Z", modifiedTime: "2020-04-20T09:00:00.000Z",
          },
        },
      },
    };
    const files: GoogleDriveFile[] = [{
      id: "FILE-1", name: "Books", createdTime: "2020-04-20T08:00:00.000Z", modifiedTime: "2020-04-20T09:06:00.000Z", // and edited elsewhere
    }];
    const updateFile = jest.fn((id: string, options: UpdateFileBodyOptions) => Promise.resolve({ id, ...options }));

    const notesAfterPull = await pull(notes, files, { getFile });
    await push("folder", notesAfterPull, { createFile: jest.fn(), updateFile });

    expect(updateFile).toHaveBeenCalledWith("FILE-1", expect.objectContaining({
      content: "my books, edited<br><br>content of FILE-1",
      modifiedTime: "2020-04-20T09:06:01.000Z",
    }));
  });
});
