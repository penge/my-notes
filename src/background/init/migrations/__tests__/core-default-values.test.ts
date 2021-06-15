import { NotesObject, Note } from "shared/storage/schema";
import migrate, { expectedKeys } from "../core";

export const expectItems = (items: Record<string, unknown>): void => {
  expect(Object.keys(items).sort()).toEqual(expectedKeys.sort());
};

const expectDefaultValues = (myItems?: Record<string, unknown>) => {
  const items = (myItems || migrate({}, {})) as Storage;
  expectItems(items);

  // font
  expect(items.font).toEqual({
    id: "helvetica",
    name: "Helvetica",
    genericFamily: "sans-serif",
    fontFamily: "Helvetica, sans-serif",
  });

  // size
  expect(items.size).toBe(200);

  // sidebar
  expect(items.sidebar).toBe(true);

  // toolbar
  expect(items.toolbar).toBe(true);

  // theme
  expect(items.theme).toBe("light");

  // custom theme
  expect(items.customTheme).toBe("");

  // notes
  const notes = items.notes as NotesObject;
  expect(Object.keys(notes).length).toBe(3); // "One", "Two", "Three"
  ["One", "Two", "Three"].every((noteName: string) => {
    const note = (notes)[noteName] as Note;

    expect(Object.keys(note).length).toBe(3); // "content", "createdTime", "modifiedTime"
    expect(note.content).toBe("");
    expect(note.createdTime).toEqual(notes.One.createdTime); // every note is created at the same moment
    expect(note.modifiedTime).toEqual(notes.One.modifiedTime); // every note is modified at the same moment

    expect(new Date(note.createdTime).getTime()).toEqual(new Date(note.modifiedTime).getTime()); // valid and equal
  });

  // active
  expect(items.active).toBe("One");

  // focus
  expect(items.focus).toBe(false);

  // tab
  expect(items.tab).toBe(false);

  // tab size
  expect(items.tabSize).toBe(-1);
};

it("returns default values", () => {
  expectDefaultValues();
});

it("fallbacks to default values", () => {
  const items = migrate({}, {
    font: {         // must be a valid "font" object
      name: "Droid Sans",
    },
    size: "large",  // must be number
    theme: "green", // must be "light" or "dark"
    sidebar: "yes", // must be boolean
    toolbar: "no",  // must be boolean
    customTheme: { background: "#ffffff" }, // must be string
    notes: null,    // must be object
    active: "Todo", // must be in "notes"
    focus: 1,       // must be boolean
    tab: 1,         // must be boolean
    tabSize: "Tab"  // must be number
  });

  expectDefaultValues(Object.assign({}, items as unknown));
});

it("fallbacks active and clipboard if possible", () => {
  const local = {
    notes: {
      Todo: {
        content: "buy milk",
        createdTime: "2020-04-20T09:02:00Z",
        modifiedTime: "2020-04-20T09:02:02Z",
        sync: {
          file: {
            id: "6073",
            name: "Todo",
            createdTime: "2020-04-20T09:02:00Z",
            modifiedTime: "2020-04-20T09:02:02Z",
          }
        }
      },
      Clipboard: {
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
      Math: {
        content: "some equations",
        createdTime: "2020-04-20T09:09:00Z",
        modifiedTime: "2020-04-20T09:09:09Z",
      },
    } as NotesObject
  };

  // Clipboard exists
  const items = migrate({}, local);
  expect(items.active).toBe("Clipboard"); // first available in A-Z order

  // Clipboard does NOT exist
  const itemsNoClipboard = migrate({}, {
    notes: {
      Todo: local.notes.Todo,
      Math: local.notes.Math,
    }
  });
  expect(itemsNoClipboard.active).toBe("Math"); // first available in A-Z order

  // Empty notes
  const noItems = migrate({}, {
    notes: {
      // empty
    }
  });
  expect(noItems.active).toBe(null);
});
