import { NotesObject, Note } from "shared/storage/schema";
import migrate from "../core";

export const expectItems = (items: Record<string, unknown>): void => {
  const expectedKeys = [ // interface Storage
    "font",
    "size",
    "sidebar",
    "toolbar",
    "theme",
    "customTheme",
    "notes",
    "active",
    "focus",
    "newtab",
    "tab",
  ];

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
  expect(Object.keys(notes).length).toBe(4); // "One", "Two", "Three", "Clipboard"
  ["One", "Two", "Three", "Clipboard"].every((noteName: string) => {
    const note = (notes)[noteName] as Note;

    expect(Object.keys(note).length).toBe(3); // "content", "createdTime", "modifiedTime"
    expect(note.content).toBe("");
    expect(note.createdTime).toEqual(notes.One.createdTime); // every note is created at the same moment
    expect(note.modifiedTime).toEqual(notes.One.modifiedTime); // every note is modified at the same moment

    expect(new Date(note.createdTime).getTime()).toEqual(new Date(note.modifiedTime).getTime()); // valid and equal
  });

  // active
  expect(items.active).toBe(null);

  // focus
  expect(items.focus).toBe(false);

  // newtab
  expect(items.newtab).toBe(false);

  // tab
  expect(items.tab).toBe(false);
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
    newtab: 1,      // must be boolean
    tab: 1,         // must be boolean
  });

  expectDefaultValues(Object.assign({}, items as unknown));
});
