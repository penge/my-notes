import { Note, NotesObject } from "shared/storage/schema";
import { CreateFileBodyOptions, UpdateFileBodyOptions } from "background/google-drive/bodies";
import merge, { orphanedFileIds } from "../merge";
import pull from "../pull";
import push from "../push";

process.env.LOG_LEVEL = "SILENT";

const note = (content: string, modifiedTime: string, fileId?: string): Note => ({
  content,
  createdTime: "2020-04-20T09:00:00Z",
  modifiedTime,
  ...(fileId ? {
    sync: {
      file: {
        id: fileId, name: "name", createdTime: "2020-04-20T09:00:00Z", modifiedTime,
      },
    },
  } : {}),
});

const T0 = "2020-04-20T09:00:00Z"; // sync started, notes read
const T1 = "2020-04-20T09:00:05Z"; // user edits while sync runs
const T2 = "2020-04-20T09:00:09Z"; // sync result written

// Notes the user touched get a fresh modifiedTime (now), newer than any 2020 fixture time
const fresh = (expected: Note) => ({ ...expected, modifiedTime: expect.not.stringMatching(/^2020-/) });

describe("merge()", () => {
  test("keeps a note untouched by the user and the sync", () => {
    const notesBeforeSync: NotesObject = { Todo: note("milk", T0, "1") };
    const notesAfterSync: NotesObject = { Todo: note("milk", T0, "1") };
    const notesCurrent: NotesObject = { Todo: note("milk", T0, "1") };

    expect(merge(notesBeforeSync, notesAfterSync, notesCurrent)).toEqual({ Todo: note("milk", T0, "1") });
  });

  test("keeps content typed while sync was running, and links the note to its pushed file", () => {
    const notesBeforeSync: NotesObject = { Todo: note("milk", T0) };
    const notesAfterSync: NotesObject = { Todo: note("milk", T0, "1") }; // pushed, file created
    const notesCurrent: NotesObject = { Todo: note("milk, coffee, bread", T1) }; // user kept typing

    const merged = merge(notesBeforeSync, notesAfterSync, notesCurrent);

    expect(merged.Todo.content).toBe("milk, coffee, bread");
    expect(merged.Todo.sync).toEqual(notesAfterSync.Todo.sync);
    expect(merged.Todo.modifiedTime > merged.Todo.sync!.file.modifiedTime).toBe(true); // pushed by the next sync
  });

  test("applies content pulled from Google Drive to a note the user did not touch", () => {
    const notesBeforeSync: NotesObject = { Todo: note("milk", T0, "1") };
    const notesAfterSync: NotesObject = { Todo: note("milk, eggs", T2, "1") }; // pulled
    const notesCurrent: NotesObject = { Todo: note("milk", T0, "1") };

    expect(merge(notesBeforeSync, notesAfterSync, notesCurrent)).toEqual(notesAfterSync);
  });

  test("appends content pulled from Google Drive to the user's content when both edited the note meanwhile", () => {
    const notesBeforeSync: NotesObject = { Todo: note("milk", T0, "1") };
    const notesAfterSync: NotesObject = { Todo: note("milk, eggs", T2, "1") }; // pulled from another device
    const notesCurrent: NotesObject = { Todo: note("milk, coffee", T1, "1") }; // edited meanwhile

    const merged = merge(notesBeforeSync, notesAfterSync, notesCurrent);

    expect(merged.Todo.content).toBe("milk, coffee<br><br>milk, eggs");
    expect(merged.Todo.modifiedTime > T2).toBe(true); // newer than the file => the editor reloads it, the next sync pushes it
    expect(merged.Todo.sync).toEqual(notesAfterSync.Todo.sync);
  });

  test("appends only what pull fetched when pull itself already merged two sides", () => {
    const notesBeforeSync: NotesObject = { Todo: note("milk, coffee", T0, "1") }; // local edit pending push
    const notesAfterSync: NotesObject = { Todo: note("milk, coffee<br><br>milk, eggs", T2, "1") }; // pull merged remote into it
    const notesCurrent: NotesObject = { Todo: note("milk, coffee, bread", T1, "1") }; // user kept typing

    expect(merge(notesBeforeSync, notesAfterSync, notesCurrent).Todo.content).toBe("milk, coffee, bread<br><br>milk, eggs");
  });

  test("deletes a note whose file was deleted in Google Drive, unless the user edited it meanwhile", () => {
    const notesBeforeSync: NotesObject = { Gone: note("a", T0, "1"), Kept: note("b", T0, "2") };
    const notesAfterSync: NotesObject = {}; // both files deleted in Google Drive
    const notesCurrent: NotesObject = { Gone: note("a", T0, "1"), Kept: note("b, c", T1, "2") };

    // Kept loses its link to the deleted file, so the next sync creates a new file for it
    expect(merge(notesBeforeSync, notesAfterSync, notesCurrent)).toEqual({ Kept: fresh(note("b, c", T1)) });
  });

  test("links an edited note to the file that replaced its deleted one", () => {
    const notesBeforeSync: NotesObject = { Todo: note("milk", T0, "1") };
    const notesAfterSync: NotesObject = { Todo: note("eggs", T2, "9") }; // file 1 deleted, file 9 of the same name created
    const notesCurrent: NotesObject = { Todo: note("milk, coffee", T1, "1") };

    const merged = merge(notesBeforeSync, notesAfterSync, notesCurrent);

    expect(merged.Todo.content).toBe("milk, coffee<br><br>eggs");
    expect(merged.Todo.sync!.file.id).toBe("9");
  });

  test("keeps a note created while sync was running", () => {
    const notesBeforeSync: NotesObject = {};
    const notesAfterSync: NotesObject = {};
    const notesCurrent: NotesObject = { New: note("fresh", T1) };

    expect(merge(notesBeforeSync, notesAfterSync, notesCurrent)).toEqual({ New: fresh(note("fresh", T1)) });
  });

  test("adds a note created by sync from a new file in Google Drive", () => {
    const notesBeforeSync: NotesObject = {};
    const notesAfterSync: NotesObject = { Remote: note("from drive", T0, "1") };
    const notesCurrent: NotesObject = {};

    expect(merge(notesBeforeSync, notesAfterSync, notesCurrent)).toEqual({ Remote: note("from drive", T0, "1") });
  });

  test("merges a note created by the user with a same-named note pulled from Google Drive", () => {
    const notesBeforeSync: NotesObject = {};
    const notesAfterSync: NotesObject = { Ideas: note("from drive", T0, "1") };
    const notesCurrent: NotesObject = { Ideas: note("mine", T1) };

    const merged = merge(notesBeforeSync, notesAfterSync, notesCurrent);

    expect(merged.Ideas.content).toBe("mine<br><br>from drive");
    expect(merged.Ideas.sync).toEqual(notesAfterSync.Ideas.sync);
  });

  test("does not resurrect a note deleted while sync was running", () => {
    const notesBeforeSync: NotesObject = { Old: note("a", T0, "1") };
    const notesAfterSync: NotesObject = { Old: note("a", T0, "1") };
    const notesCurrent: NotesObject = {}; // deleted meanwhile

    expect(merge(notesBeforeSync, notesAfterSync, notesCurrent)).toEqual({});
  });

  test("keeps a rename made while sync was running", () => {
    const notesBeforeSync: NotesObject = { Old: note("a", T0, "1") };
    const notesAfterSync: NotesObject = { Old: note("a", T0, "1") };
    const notesCurrent: NotesObject = { New: note("a", T1, "1") }; // renamed meanwhile, rename bumps modifiedTime

    expect(merge(notesBeforeSync, notesAfterSync, notesCurrent)).toEqual({ New: { ...fresh(note("a", T1)), sync: notesAfterSync.Old.sync } });
  });

  test("keeps a rename and an edit made while sync was running, and appends content pulled for the file meanwhile", () => {
    const notesBeforeSync: NotesObject = { Old: note("a", T0, "1") };
    const notesAfterSync: NotesObject = { Old: note("a, remote", T2, "1") }; // pulled
    const notesCurrent: NotesObject = { New: note("a, mine", T1, "1") }; // renamed and edited meanwhile

    const merged = merge(notesBeforeSync, notesAfterSync, notesCurrent);

    expect(Object.keys(merged)).toEqual(["New"]);
    expect(merged.New.content).toBe("a, mine<br><br>a, remote");
    expect(merged.New.sync).toEqual(notesAfterSync.Old.sync);
  });

  test("takes the pulled content as it is for a note the user only renamed meanwhile", () => {
    const notesBeforeSync: NotesObject = { Old: note("old", T0, "1") };
    const notesAfterSync: NotesObject = { Old: note("new", T2, "1") }; // pulled
    const notesCurrent: NotesObject = { Renamed: note("old", T1, "1") }; // renamed, content untouched

    const merged = merge(notesBeforeSync, notesAfterSync, notesCurrent);

    expect(Object.keys(merged)).toEqual(["Renamed"]);
    expect(merged.Renamed.content).toBe("new");
  });

  test("does not bring back a note deleted meanwhile when pull renamed it to follow its file", () => {
    const notesBeforeSync: NotesObject = { A: note("a", T0, "1") };
    const notesAfterSync: NotesObject = { B: note("a", T2, "1") }; // file 1 renamed to B in Google Drive
    const notesCurrent: NotesObject = {}; // user deleted A meanwhile

    expect(merge(notesBeforeSync, notesAfterSync, notesCurrent)).toEqual({});
  });

  test("keeps an edit stamped earlier than the note's time, which came from another device's clock", () => {
    const notesBeforeSync: NotesObject = { Todo: note("milk", T2, "1") }; // pulled earlier, other device ahead
    const notesAfterSync: NotesObject = { Todo: note("milk", T2, "1") };
    const notesCurrent: NotesObject = { Todo: note("milk, coffee", T1, "1") }; // edited here, local clock behind

    expect(merge(notesBeforeSync, notesAfterSync, notesCurrent).Todo.content).toBe("milk, coffee");
  });

  test("keeps a note created meanwhile apart from a note pull renamed to the same name", () => {
    const notesBeforeSync: NotesObject = { A: note("a", T0, "1") };
    const notesAfterSync: NotesObject = { B: note("a", T2, "1") }; // file 1 renamed to B in Google Drive
    const notesCurrent: NotesObject = { A: note("a", T0, "1"), B: note("mine", T1) }; // user created an unrelated B

    const merged = merge(notesBeforeSync, notesAfterSync, notesCurrent);

    expect(merged.A).toEqual(note("a", T2, "1")); // keeps its old name
    expect(merged.B.content).toBe("mine");
    expect(merged.B.sync).toBeUndefined(); // not linked to the other note's file
  });

  test("keeps lock, pin and raw changed while sync was running, which do not bump modifiedTime", () => {
    const notesBeforeSync: NotesObject = { Todo: note("milk", T0, "1") };
    const notesAfterSync: NotesObject = { Todo: note("milk, eggs", T2, "1") }; // pulled
    const notesCurrent: NotesObject = {
      Todo: {
        ...note("milk", T0, "1"), locked: true, pinnedTime: T1, raw: true,
      },
    };

    expect(merge(notesBeforeSync, notesAfterSync, notesCurrent)).toEqual({
      Todo: {
        ...note("milk, eggs", T2, "1"), locked: true, pinnedTime: T1, raw: true,
      },
    });
  });

  test("keeps a note unpinned while sync was running", () => {
    const notesBeforeSync: NotesObject = { Todo: { ...note("milk", T0, "1"), pinnedTime: T0 } };
    const notesAfterSync: NotesObject = { Todo: { ...note("milk", T0, "1"), pinnedTime: T0 } };
    const notesCurrent: NotesObject = { Todo: note("milk", T0, "1") }; // unpinned meanwhile; storage drops the undefined key

    expect(merge(notesBeforeSync, notesAfterSync, notesCurrent).Todo.pinnedTime).toBeUndefined();
  });

  test("keeps a pin set while pull renamed the note to follow its file", () => {
    const notesBeforeSync: NotesObject = { A: note("a", T0, "1") };
    const notesAfterSync: NotesObject = { B: note("a", T2, "1") }; // file 1 renamed to B in Google Drive
    const notesCurrent: NotesObject = { A: { ...note("a", T0, "1"), pinnedTime: T1 } }; // pinned meanwhile

    expect(merge(notesBeforeSync, notesAfterSync, notesCurrent)).toEqual({ B: { ...note("a", T2, "1"), pinnedTime: T1 } });
  });

  test("drops the renamed copy when pull renamed a note the user edited meanwhile, keeping the pulled content", () => {
    const notesBeforeSync: NotesObject = { A: note("a", T0, "1") };
    const notesAfterSync: NotesObject = { B: note("a, remote", T2, "1") }; // file 1 renamed to B and edited in Google Drive
    const notesCurrent: NotesObject = { A: note("a, b", T1, "1") }; // user edited A meanwhile

    const merged = merge(notesBeforeSync, notesAfterSync, notesCurrent);

    expect(Object.keys(merged)).toEqual(["A"]);
    expect(merged.A.content).toBe("a, b<br><br>a, remote");
    expect(merged.A.sync).toEqual(notesAfterSync.B.sync);
  });

  test("keeps both the original and its duplicate made while sync was running", () => {
    const notesBeforeSync: NotesObject = { A: note("a", T0, "1") };
    const notesAfterSync: NotesObject = { A: note("a", T0, "1") };
    const notesCurrent: NotesObject = { A: note("a", T0, "1"), "A (1)": note("a", T1, "1") }; // duplicate copies the file link

    expect(merge(notesBeforeSync, notesAfterSync, notesCurrent)).toEqual({
      A: note("a", T0, "1"),
      "A (1)": { ...fresh(note("a", T1)), sync: notesAfterSync.A.sync }, // the link is taken from the note after sync
    });
  });
});

describe("orphanedFileIds()", () => {
  test("lists files created by push for notes the user deleted or renamed meanwhile", () => {
    const listed = ["3"]; // files in Google Drive before this sync
    const notesAfterSync: NotesObject = { // files 1 and 2 created by push
      Deleted: note("a", T0, "1"), Renamed: note("b", T0, "2"), Kept: note("c", T0, "3"),
    };
    const merged: NotesObject = { "Renamed 2": note("b", T1), Kept: note("c", T0, "3") };

    expect(orphanedFileIds(listed, notesAfterSync, merged)).toEqual(["1", "2"]);
  });

  test("ignores files pulled from Google Drive and files held under another name", () => {
    const listed = ["1", "2"];
    const notesAfterSync: NotesObject = { Remote: note("r", T0, "1"), B: note("a", T2, "2") }; // 1 pulled as a new note, 2 renamed by pull
    const merged: NotesObject = { Remote: note("r", T0, "1"), A: note("a, b", T1, "2") };

    expect(orphanedFileIds(listed, notesAfterSync, merged)).toEqual([]);
  });
});

describe("merge() and orphanedFileIds() after the real pull and push", () => {
  const file = (id: string, name: string, modifiedTime: string) => ({
    id, name, createdTime: T0, modifiedTime,
  });
  const getFile = async (id: string) => `content of ${id}`;
  const createFile = async (_folderId: string, options: CreateFileBodyOptions) => ({ id: `created-${options.name}`, ...options });
  const updateFile = async (id: string, options: UpdateFileBodyOptions) => ({ id, ...options });

  test("push mutates the notes it was given, which must not hide a deleted note's new file", async () => {
    const notesBeforeSync: NotesObject = { New: note("fresh", T0) }; // no file yet
    const files = [file("remote-1", "Remote", T0)]; // listing taken before pull
    const notesCurrent: NotesObject = {}; // user deleted New while push created its file

    const afterPull = await pull(notesBeforeSync, files, { getFile });
    const notesAfterSync = await push("folder", afterPull, { createFile, updateFile });
    const merged = merge(notesBeforeSync, notesAfterSync, notesCurrent);

    expect(merged).toEqual({ Remote: expect.objectContaining({ content: "content of remote-1" }) });
    expect(orphanedFileIds(files.map((f) => f.id), notesAfterSync, merged)).toEqual(["created-New"]);
  });
});
