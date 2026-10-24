import { NotesObject, GoogleDriveFile } from "shared/storage/schema";
import { GetFileFunction, DownloadError } from "background/google-drive/api";
import pullUpdate from "../pull-update";

const getFile: GetFileFunction = (fileId: string) => Promise.resolve(`content from ${fileId}`);

// "Now" for the stamp of merged notes, later than every local edit below
beforeEach(() => jest.spyOn(Date, "now").mockReturnValue(Date.parse("2020-04-20T09:05:00.000Z")));
afterEach(() => jest.restoreAllMocks());

describe("pullUpdate()", () => {
  describe("note is synced", () => {
    describe("note is NOT modified since the last sync", () => {
      describe("file is NOT modified since the last sync", () => {
        test("note remains unchanged", async () => {
          const notes: NotesObject = {
            Books: {
              content: "my books",
              createdTime: "CT",
              modifiedTime: "MT",
              sync: {
                file: {
                  id: "FILE-123",
                  name: "Books",
                  createdTime: "CT",
                  modifiedTime: "MT",
                },
              },
              locked: true,
              pinnedTime: "PT",
            },
          };

          const files: GoogleDriveFile[] = [
            {
              id: "FILE-123",
              name: "Books",
              createdTime: "CT",
              modifiedTime: "MT",
            },
          ];

          const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
          expect(notesAfterPullUpdate).toEqual(notes);
        });
      });

      describe("file is modified since the last sync", () => {
        test("note content is replaced with file content", async () => {
          const notes: NotesObject = {
            Books: {
              content: "my books",
              createdTime: "CT",
              modifiedTime: "MT",
              sync: {
                file: {
                  id: "FILE-123",
                  name: "Books",
                  createdTime: "CT",
                  modifiedTime: "MT",
                },
              },
              locked: true,
              pinnedTime: "PT",
              raw: true,
            },
          };

          const files: GoogleDriveFile[] = [
            {
              id: "FILE-123",
              name: "Books",
              createdTime: "CT",
              modifiedTime: "MT-2",
            },
          ];

          const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
          expect(notesAfterPullUpdate).toEqual({
            Books: {
              content: "content from FILE-123",
              createdTime: "CT",
              modifiedTime: "MT-2",
              sync: {
                file: {
                  id: "FILE-123",
                  name: "Books",
                  createdTime: "CT",
                  modifiedTime: "MT-2",
                },
              },
              locked: true,
              pinnedTime: "PT",
              raw: true,
            },
          });
        });
      });

      describe("file is modified since the last sync, and renamed", () => {
        test("note content is replaced with file content, and note is renamed", async () => {
          const notes: NotesObject = {
            Books: {
              content: "my books",
              createdTime: "CT",
              modifiedTime: "MT",
              sync: {
                file: {
                  id: "FILE-123",
                  name: "Books",
                  createdTime: "CT",
                  modifiedTime: "MT",
                },
              },
            },
          };

          const files: GoogleDriveFile[] = [
            {
              id: "FILE-123",
              name: "Readings",
              createdTime: "CT",
              modifiedTime: "MT-2",
            },
          ];

          const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
          expect(notesAfterPullUpdate).toEqual({
            Readings: {
              content: "content from FILE-123",
              createdTime: "CT",
              modifiedTime: "MT-2",
              sync: {
                file: {
                  id: "FILE-123",
                  name: "Readings",
                  createdTime: "CT",
                  modifiedTime: "MT-2",
                },
              },
            },
          });
        });
      });
    });

    describe("note is modified since the last sync", () => {
      describe("file is modified since the last sync", () => {
        describe("note is the latest update", () => {
          test("note remains unchanged, it is candidate for push", async () => {
            const notes: NotesObject = {
              Books: {
                content: "my books",
                createdTime: "CT",
                modifiedTime: "MT-3",
                sync: {
                  file: {
                    id: "FILE-123",
                    name: "Books",
                    createdTime: "CT",
                    modifiedTime: "MT",
                  },
                },
              },
            };

            const files: GoogleDriveFile[] = [
              {
                id: "FILE-123",
                name: "Books",
                createdTime: "CT",
                modifiedTime: "MT-2",
              },
            ];

            const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
            expect(notesAfterPullUpdate).toEqual(notes);
          });
        });

        describe("file is the latest update", () => {
          test("note content is merged with file content, stamped 1 second after the file's time, later than now", async () => {
            const notes: NotesObject = {
              Books: {
                content: "my books",
                createdTime: "CT",
                modifiedTime: "2020-04-20T09:04:00.000Z",
                sync: {
                  file: {
                    id: "FILE-123",
                    name: "Books",
                    createdTime: "CT",
                    modifiedTime: "2020-04-20T09:00:00.000Z",
                  },
                },
              },
            };

            const files: GoogleDriveFile[] = [
              {
                id: "FILE-123",
                name: "Books",
                createdTime: "CT",
                modifiedTime: "2020-04-20T09:06:00.000Z",
              },
            ];

            const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
            expect(notesAfterPullUpdate).toEqual({
              Books: {
                content: "my books<br><br>content from FILE-123",
                createdTime: "CT",
                modifiedTime: "2020-04-20T09:06:01.000Z",
                sync: {
                  file: {
                    id: "FILE-123",
                    name: "Books",
                    createdTime: "CT",
                    modifiedTime: "2020-04-20T09:06:00.000Z",
                  },
                },
              },
            });
          });
        });

        describe("file is the latest update, and renamed", () => {
          test("note content is merged with file content, stamped 1 second after the file's time, and note is renamed", async () => {
            const notes: NotesObject = {
              Books: {
                content: "my books",
                createdTime: "CT",
                modifiedTime: "2020-04-20T09:04:00.000Z",
                sync: {
                  file: {
                    id: "FILE-123",
                    name: "Books",
                    createdTime: "CT",
                    modifiedTime: "2020-04-20T09:00:00.000Z",
                  },
                },
              },
            };

            const files: GoogleDriveFile[] = [
              {
                id: "FILE-123",
                name: "Wishlist",
                createdTime: "CT",
                modifiedTime: "2020-04-20T09:07:00.000Z",
              },
            ];

            const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
            expect(notesAfterPullUpdate).toEqual({
              Wishlist: {
                content: "my books<br><br>content from FILE-123",
                createdTime: "CT",
                modifiedTime: "2020-04-20T09:07:01.000Z",
                sync: {
                  file: {
                    id: "FILE-123",
                    name: "Wishlist",
                    createdTime: "CT",
                    modifiedTime: "2020-04-20T09:07:00.000Z",
                  },
                },
              },
            });
          });
        });
      });
    });
  });

  describe("note is NOT synced", () => {
    describe("note and file have the same modified time", () => {
      test("sync property is added, note content is unchanged", async () => {
        const notes: NotesObject = {
          Books: {
            content: "my books",
            createdTime: "CT",
            modifiedTime: "MT",
          },
        };

        const files: GoogleDriveFile[] = [
          {
            id: "FILE-123",
            name: "Books",
            createdTime: "CT",
            modifiedTime: "MT",
          },
        ];

        const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
        expect(notesAfterPullUpdate).toEqual({
          Books: {
            content: "my books",
            createdTime: "CT",
            modifiedTime: "MT",
            sync: {
              file: {
                id: "FILE-123",
                name: "Books",
                createdTime: "CT",
                modifiedTime: "MT",
              },
            },
          },
        });
      });
    });

    describe("note and file do NOT have the same modified time", () => {
      describe("note is newer", () => {
        test("sync property is added, note content is merged with file content, stamped now, later than the file's time plus 1 second", async () => {
          const notes: NotesObject = {
            Books: {
              content: "my books",
              createdTime: "CT",
              modifiedTime: "2020-04-20T09:02:00.000Z",
            },
          };

          const files: GoogleDriveFile[] = [
            {
              id: "FILE-123",
              name: "Books",
              createdTime: "CT",
              modifiedTime: "2020-04-20T09:00:00.000Z",
            },
          ];

          const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
          expect(notesAfterPullUpdate).toEqual({
            Books: {
              content: "my books<br><br>content from FILE-123",
              createdTime: "CT",
              modifiedTime: "2020-04-20T09:05:00.000Z",
              sync: {
                file: {
                  id: "FILE-123",
                  name: "Books",
                  createdTime: "CT",
                  modifiedTime: "2020-04-20T09:00:00.000Z",
                },
              },
            },
          });
        });
      });

      describe("file is newer", () => {
        test("sync property is added, note content is merged with file content, stamped now, later than the file's time plus 1 second", async () => {
          const notes: NotesObject = {
            Books: {
              content: "my books",
              createdTime: "CT",
              modifiedTime: "2020-04-20T09:02:00.000Z",
            },
          };

          const files: GoogleDriveFile[] = [
            {
              id: "FILE-123",
              name: "Books",
              createdTime: "CT",
              modifiedTime: "2020-04-20T09:03:00.000Z",
            },
          ];

          const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
          expect(notesAfterPullUpdate).toEqual({
            Books: {
              content: "my books<br><br>content from FILE-123",
              createdTime: "CT",
              modifiedTime: "2020-04-20T09:05:00.000Z",
              sync: {
                file: {
                  id: "FILE-123",
                  name: "Books",
                  createdTime: "CT",
                  modifiedTime: "2020-04-20T09:03:00.000Z",
                },
              },
            },
          });
        });
      });
    });
  });
});

describe("pullUpdate() when things go wrong", () => {
  const syncedNote = (content: string, fileId: string, name: string) => ({
    content,
    createdTime: "CT",
    modifiedTime: "MT",
    sync: {
      file: {
        id: fileId, name, createdTime: "CT", modifiedTime: "MT",
      },
    },
  });

  test("fails if a file cannot be downloaded, so the sync run writes and pushes nothing", async () => {
    const notes: NotesObject = { Books: { ...syncedNote("my books, edited", "FILE-1", "Books"), modifiedTime: "MT3" } }; // edited on both sides
    const files: GoogleDriveFile[] = [{
      id: "FILE-1", name: "Books", createdTime: "CT", modifiedTime: "MT4",
    }];

    await expect(pullUpdate(notes, files, () => Promise.resolve(undefined))).rejects.toThrow(DownloadError);
  });

  test("note keeps its name if its file was renamed to the name of another note", async () => {
    const notes: NotesObject = {
      Books: syncedNote("my books", "FILE-1", "Books"),
      Movies: { content: "my movies", createdTime: "CT", modifiedTime: "MT" }, // unrelated note
    };
    const files: GoogleDriveFile[] = [{
      id: "FILE-1", name: "Movies", createdTime: "CT", modifiedTime: "MT2", // renamed in Google Drive
    }];

    const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
    expect(notesAfterPullUpdate.Movies).toEqual(notes.Movies);
    expect(notesAfterPullUpdate.Books.content).toBe("content from FILE-1");
  });

  test("an unlinked note takes the content of only one of two files with its name, once", async () => {
    const notes: NotesObject = {
      // unlinked, e.g. after sync was turned off and on
      Books: { content: "my books", createdTime: "2020-04-20T08:00:00.000Z", modifiedTime: "2020-04-20T09:00:00.000Z" },
    };
    const files: GoogleDriveFile[] = [
      {
        id: "FILE-1", name: "Books", createdTime: "2020-04-20T08:00:00.000Z", modifiedTime: "2020-04-20T09:01:00.000Z",
      },
      {
        id: "FILE-2", name: "Books", createdTime: "2020-04-20T08:00:00.000Z", modifiedTime: "2020-04-20T09:02:00.000Z",
      },
    ];

    const afterFirstSync = await pullUpdate(notes, files, getFile);
    expect(afterFirstSync.Books.content).toBe("my books<br><br>content from FILE-1");
    expect(afterFirstSync.Books.sync!.file.id).toBe("FILE-1");

    const afterSecondSync = await pullUpdate(afterFirstSync, files, getFile);
    expect(afterSecondSync).toEqual(afterFirstSync); // the other file is not merged in on every sync
  });
});
