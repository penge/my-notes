import {
  Note, NotesObject, GoogleDriveFile, Sync, SyncLookup,
} from "shared/storage/schema";
import { CreateFileBodyOptions, UpdateFileBodyOptions } from "background/google-drive/bodies";
import syncNotes, { SyncNotesDeps } from "../sync-notes";

process.env.LOG_LEVEL = "SILENT";

const T0 = "2020-04-20T09:00:00.000Z"; // last sync
const T1 = "2020-04-20T09:04:00.000Z"; // edited here
const T2 = "2020-04-20T09:06:00.000Z"; // edited elsewhere

// "Now" for the stamp of merged notes, later than every local edit below
beforeEach(() => jest.spyOn(Date, "now").mockReturnValue(Date.parse("2020-04-20T09:05:00.000Z")));
afterEach(() => jest.restoreAllMocks());

const note = (content: string, modifiedTime: string, fileId?: string, fileModifiedTime = modifiedTime): Note => ({
  content,
  createdTime: T0,
  modifiedTime,
  ...(fileId ? {
    sync: {
      file: {
        id: fileId, name: "name", createdTime: T0, modifiedTime: fileModifiedTime,
      },
    },
  } : {}),
});

const file = (id: string, name: string, modifiedTime: string): GoogleDriveFile => ({
  id, name, createdTime: T0, modifiedTime,
});

const settings: Sync = {
  folderId: "folder", folderLocation: "location", assetsFolderId: "assets",
};

const lookup = (files: GoogleDriveFile[]): SyncLookup => ({ ...settings, files });

// The reads of storage a sync run is expected to make, in order: each is the
// key read and the value storage holds for it at that moment
type Read = ["notes", NotesObject] | ["sync", Sync | undefined];

// Google Drive and storage stubs. Storage answers `reads` in order and throws
// on a read of another key than expected; `unread` lists the reads that never
// happened, so a test can check the run made all of them
const stubs = (reads: Read[]) => {
  const expected = [...reads];
  const deps: SyncNotesDeps = {
    drive: {
      getFile: async (id: string) => `content of ${id}`,
      createFile: jest.fn(async (_folderId: string, options: CreateFileBodyOptions) => ({ id: `created-${options.name}`, ...options })),
      updateFile: jest.fn(async (id: string, options: UpdateFileBodyOptions) => ({ id, ...options })),
      deleteFile: jest.fn(async () => true),
    },
    storage: {
      getItem: (async (key: string) => {
        const read = expected.shift();
        if (!read || read[0] !== key) {
          throw new Error(`unexpected read of "${key}", expected ${read ? `"${read[0]}"` : "no more reads"}`);
        }

        return read[1];
      }) as SyncNotesDeps["storage"]["getItem"],
      setItems: jest.fn(async () => undefined),
    },
  };
  const storedNotes = (): NotesObject => (deps.storage.setItems as jest.Mock).mock.calls[0][0].notes;
  const unread = (): string[] => expected.map(([key]) => key);
  return { deps, storedNotes, unread };
};

test("syncNotes() uploads and stores a note merged with its file", async () => {
  const notes: NotesObject = { Books: note("my books, edited", T1, "FILE-1", T0) }; // edited here since the last sync
  const { deps, storedNotes, unread } = stubs([["notes", notes], ["sync", settings], ["notes", notes]]);

  const synced = await syncNotes(lookup([file("FILE-1", "Books", T2)]), deps); // and edited elsewhere

  expect(unread()).toEqual([]);
  expect(synced).toBe(true);
  expect(deps.drive.updateFile).toHaveBeenCalledWith("FILE-1", expect.objectContaining({
    content: "my books, edited<br><br>content of FILE-1",
    modifiedTime: "2020-04-20T09:06:01.000Z",
  }));
  expect(storedNotes().Books.content).toBe("my books, edited<br><br>content of FILE-1");
});

test("syncNotes() keeps text typed while it was running", async () => {
  const before: NotesObject = { Todo: note("milk", T0, "FILE-1") };
  const current: NotesObject = { Todo: note("milk, coffee", T1, "FILE-1", T0) }; // typed during the sync
  const { deps, storedNotes, unread } = stubs([["notes", before], ["sync", settings], ["notes", current]]);

  await syncNotes(lookup([file("FILE-1", "Todo", T0)]), deps);

  expect(unread()).toEqual([]);
  expect(storedNotes().Todo.content).toBe("milk, coffee");
});

test("syncNotes() deletes a file it created for a note deleted meanwhile, and keeps a pulled file", async () => {
  const before: NotesObject = { New: note("fresh", T0) }; // no file yet
  const { deps, storedNotes, unread } = stubs([["notes", before], ["sync", settings], ["notes", {}]]); // New deleted while push created its file

  await syncNotes(lookup([file("remote-1", "Remote", T0)]), deps);

  expect(unread()).toEqual([]);
  expect(Object.keys(storedNotes())).toEqual(["Remote"]);
  expect(deps.drive.deleteFile).toHaveBeenCalledTimes(1);
  expect(deps.drive.deleteFile).toHaveBeenCalledWith("created-New");
});

test("syncNotes() writes and deletes nothing when sync was stopped meanwhile", async () => {
  const before: NotesObject = { New: note("fresh", T0) };
  // Sync was stopped while pull and push ran, so the read of "sync" after them
  // returns nothing, and the notes are not read again
  const { deps, unread } = stubs([["notes", before], ["sync", undefined]]);

  const synced = await syncNotes(lookup([]), deps);

  expect(unread()).toEqual([]);
  expect(synced).toBe(false);
  expect(deps.storage.setItems).not.toHaveBeenCalled();
  expect(deps.drive.deleteFile).not.toHaveBeenCalled();
});
