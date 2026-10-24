import { NotesObject } from "shared/storage/schema";
import duplicateNote from "../duplicate-note";

const notes: NotesObject = {
  Groceries: {
    content: "milk",
    createdTime: "2020-04-20T09:00:00Z",
    modifiedTime: "2020-04-20T09:00:00Z",
    sync: {
      file: {
        id: "FILE-1", name: "Groceries", createdTime: "2020-04-20T09:00:00Z", modifiedTime: "2020-04-20T09:00:00Z",
      },
    },
    pinnedTime: "2020-04-20T09:30:00Z",
  },
};

const set = jest.fn();

beforeEach(() => {
  Object.assign(global, {
    chrome: {
      storage: {
        local: {
          get: (_keys: string[], callback: (items: { notes: NotesObject }) => void) => callback({ notes }),
          set,
        },
      },
    },
  });
});

afterEach(() => {
  delete (global as { chrome?: unknown }).chrome;
  set.mockReset();
  jest.useRealTimers();
});

test("duplicateNote() creates the duplicate without the original's file link", () => {
  jest.useFakeTimers().setSystemTime(new Date("2020-04-21T12:00:00Z"));

  duplicateNote("Groceries");

  const saved: NotesObject = set.mock.calls[0][0].notes;
  expect(saved.Groceries.sync).toEqual(notes.Groceries.sync); // the original keeps its link
  const duplicate = saved[Object.keys(saved).find((name) => name !== "Groceries")!];
  expect(duplicate.content).toBe("milk");
  expect(duplicate.pinnedTime).toBe(notes.Groceries.pinnedTime);
  expect(duplicate.sync).toBeUndefined();
  expect(duplicate.createdTime).toBe("2020-04-21T12:00:00.000Z");
  expect(duplicate.modifiedTime).toBe("2020-04-21T12:00:00.000Z");
  expect(duplicate.createdTime > notes.Groceries.createdTime).toBe(true); // pullUnshare keeps the link on the note created first
});
