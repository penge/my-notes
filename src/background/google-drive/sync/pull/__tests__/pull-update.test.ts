import { NotesObject, GoogleDriveFile } from "shared/storage/schema";
import { GetFileFunction } from "background/google-drive/api";
import { pullUpdate } from "../pull-update";

const getFile: GetFileFunction = (fileId: string) => Promise.resolve(`content from ${fileId}`);

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
                }
              }
            }
          };

          const files: GoogleDriveFile[] = [
            {
              id: "FILE-123",
              name: "Books",
              createdTime: "CT",
              modifiedTime: "MT",
            }
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
                }
              }
            }
          };

          const files: GoogleDriveFile[] = [
            {
              id: "FILE-123",
              name: "Books",
              createdTime: "CT",
              modifiedTime: "MT-2",
            }
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
                }
              }
            }
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
                }
              }
            }
          };

          const files: GoogleDriveFile[] = [
            {
              id: "FILE-123",
              name: "Readings",
              createdTime: "CT",
              modifiedTime: "MT-2",
            }
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
                }
              }
            }
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
                  }
                }
              }
            };

            const files: GoogleDriveFile[] = [
              {
                id: "FILE-123",
                name: "Books",
                createdTime: "CT",
                modifiedTime: "MT-2",
              }
            ];

            const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
            expect(notesAfterPullUpdate).toEqual(notes);
          });
        });

        describe("file is the latest update", () => {
          test("note content is merged with file content, file's modified time is definitive", async () => {
            const notes: NotesObject = {
              Books: {
                content: "my books",
                createdTime: "CT",
                modifiedTime: "MT-4",
                sync: {
                  file: {
                    id: "FILE-123",
                    name: "Books",
                    createdTime: "CT",
                    modifiedTime: "MT",
                  }
                }
              }
            };

            const files: GoogleDriveFile[] = [
              {
                id: "FILE-123",
                name: "Books",
                createdTime: "CT",
                modifiedTime: "MT-6",
              }
            ];

            const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
            expect(notesAfterPullUpdate).toEqual({
              Books: {
                content: "my books<br><br>content from FILE-123",
                createdTime: "CT",
                modifiedTime: "MT-6",
                sync: {
                  file: {
                    id: "FILE-123",
                    name: "Books",
                    createdTime: "CT",
                    modifiedTime: "MT-6",
                  }
                }
              }
            });
          });
        });

        describe("file is the latest update, and renamed", () => {
          test("note content is merged with file content, file's modified time is definitive, and note is renamed", async () => {
            const notes: NotesObject = {
              Books: {
                content: "my books",
                createdTime: "CT",
                modifiedTime: "MT-4",
                sync: {
                  file: {
                    id: "FILE-123",
                    name: "Books",
                    createdTime: "CT",
                    modifiedTime: "MT",
                  }
                }
              }
            };

            const files: GoogleDriveFile[] = [
              {
                id: "FILE-123",
                name: "Wishlist",
                createdTime: "CT",
                modifiedTime: "MT-7",
              }
            ];

            const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
            expect(notesAfterPullUpdate).toEqual({
              Wishlist: {
                content: "my books<br><br>content from FILE-123",
                createdTime: "CT",
                modifiedTime: "MT-7",
                sync: {
                  file: {
                    id: "FILE-123",
                    name: "Wishlist",
                    createdTime: "CT",
                    modifiedTime: "MT-7",
                  }
                }
              }
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
          }
        };

        const files: GoogleDriveFile[] = [
          {
            id: "FILE-123",
            name: "Books",
            createdTime: "CT",
            modifiedTime: "MT",
          }
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
              }
            }
          }
        });
      });
    });

    describe("note and file do NOT have the same modified time", () => {
      describe("note is newer", () => {
        test("sync property is added, note content is merged with file content, file's modified time is definitive", async () => {
          const notes: NotesObject = {
            Books: {
              content: "my books",
              createdTime: "CT",
              modifiedTime: "MT-2",
            }
          };

          const files: GoogleDriveFile[] = [
            {
              id: "FILE-123",
              name: "Books",
              createdTime: "CT",
              modifiedTime: "MT",
            }
          ];

          const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
          expect(notesAfterPullUpdate).toEqual({
            Books: {
              content: "my books<br><br>content from FILE-123",
              createdTime: "CT",
              modifiedTime: "MT",
              sync: {
                file: {
                  id: "FILE-123",
                  name: "Books",
                  createdTime: "CT",
                  modifiedTime: "MT",
                }
              }
            }
          });
        });
      });

      describe("file is newer", () => {
        test("sync property is added, note content is merged with file content, file's modified time is definitive", async () => {
          const notes: NotesObject = {
            Books: {
              content: "my books",
              createdTime: "CT",
              modifiedTime: "MT-2",
            }
          };

          const files: GoogleDriveFile[] = [
            {
              id: "FILE-123",
              name: "Books",
              createdTime: "CT",
              modifiedTime: "MT-3",
            }
          ];

          const notesAfterPullUpdate = await pullUpdate(notes, files, getFile);
          expect(notesAfterPullUpdate).toEqual({
            Books: {
              content: "my books<br><br>content from FILE-123",
              createdTime: "CT",
              modifiedTime: "MT-3",
              sync: {
                file: {
                  id: "FILE-123",
                  name: "Books",
                  createdTime: "CT",
                  modifiedTime: "MT-3",
                }
              }
            }
          });
        });
      });
    });
  });
});
