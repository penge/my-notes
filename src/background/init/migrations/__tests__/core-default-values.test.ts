import { Storage, NotesObject, Note, NotesOrder } from "shared/storage/schema";
import migrate from "../core";
import { expectItems } from "./helpers";

const expectDefaultValues = (items: Storage) => {
  expectItems(items);

  let counter = 0;
  const countedExpect = () => {
    counter += 1;
    return expect;
  };

  // Appearance
  countedExpect()(items.font).toEqual({
    id: "helvetica",
    name: "Helvetica",
    genericFamily: "sans-serif",
    fontFamily: "Helvetica, sans-serif",
  });
  countedExpect()(items.size).toBe(200);
  countedExpect()(items.theme).toBe("light");
  countedExpect()(items.customTheme).toBe("");
  countedExpect()(items.sidebar).toBe(true);
  countedExpect()(items.toolbar).toBe(true);

  // Notes
  const notes = items.notes as NotesObject;
  countedExpect()(Object.keys(notes).length).toBe(3); // "One", "Two", "Three"
  ["One", "Two", "Three"].every((noteName: string) => {
    const note = (notes)[noteName] as Note;

    expect(Object.keys(note).length).toBe(3); // "content", "createdTime", "modifiedTime"
    expect(note.content).toBe("");
    expect(note.createdTime).toEqual(notes.One.createdTime); // every note is created at the same moment
    expect(note.modifiedTime).toEqual(notes.One.modifiedTime); // every note is modified at the same moment

    expect(new Date(note.createdTime).getTime()).toEqual(new Date(note.modifiedTime).getTime()); // valid and equal
  });
  countedExpect()(items.order).toEqual([]);
  countedExpect()(items.active).toBe("One");
  countedExpect()(items.setBy).toBe("");
  countedExpect()(items.lastEdit).toBe("");

  // Options
  countedExpect()(items.notesOrder).toBe(NotesOrder.Alphabetical);
  countedExpect()(items.focus).toBe(false);
  countedExpect()(items.tab).toBe(false);
  countedExpect()(items.tabSize).toBe(-1);
  countedExpect()(items.autoSync).toBe(false);
  countedExpect()(items.openNoteOnMouseHover).toBe(false);

  // Expect all keys to be tested
  expect(counter).toBe(Object.keys(items).length);
};

it("migrates to default values for an empty storage", () => {
  expectDefaultValues(migrate({}, {}));
});

it("fallbacks to default values for any bad values", () => {
  const items = migrate({}, {
    // Appearance
    font: {         // must be a valid "font" object
      name: "Droid Sans",
    },
    size: "large",  // must be number
    theme: "green", // must be "light" or "dark"
    customTheme: { background: "#ffffff" }, // must be string
    sidebar: "yes", // must be boolean
    toolbar: "no",  // must be boolean

    // Notes
    notes: null,    // must be object
    order: "AZ",    // must be []
    active: "Todo", // must be in "notes"
    setBy: 1,       // must be string
    lastEdit: 2,    // must be string

    // Options
    focus: 1,       // must be boolean
    tab: 1,         // must be boolean
    tabSize: "Tab", // must be number
    openNoteOnMouseHover: "yes" // must be boolean
  });

  expectDefaultValues(Object.assign({}, items));
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
