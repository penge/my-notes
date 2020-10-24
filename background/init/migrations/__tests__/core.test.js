/* global console */

import migrate from "../core.js";
import runTests from "../../../../tests/run-tests.js";

const assertItems = (items) => {
  console.assert(Object.keys(items).length === 9);
  console.assert([
    "font",
    "size",
    "theme",
    "customTheme",
    "notes",
    "active",
    "focus",
    "newtab",
    "tab",
  ].every(key => key in items));
};

const testDefaultValues = (myItems) => {
  const items = myItems || migrate({}, {});
  assertItems(items);

  // font
  console.assert(items.font.id === "helvetica");
  console.assert(items.font.name === "Helvetica");
  console.assert(items.font.genericFamily === "sans-serif");
  console.assert(items.font.fontFamily === "Helvetica, sans-serif");
  console.assert(Object.keys(items.font).length === 4);

  // size
  console.assert(items.size === 200);

  // theme
  console.assert(items.theme === "light");

  // custom theme
  console.assert(items.customTheme === "");

  // notes
  console.assert(Object.keys(items.notes).length === 4);
  ["One", "Two", "Three", "Clipboard"].every(noteName => {
    const note = items.notes[noteName];

    console.assert(Object.keys(note).length === 3); // "content", "createdTime", "modifiedTime"
    console.assert(note.content === "");
    console.assert(note.createdTime === items.notes.One.createdTime); // every note is created at the same moment
    console.assert(note.modifiedTime === items.notes.One.modifiedTime); // every note is modified at the same moment

    console.assert(new Date(note.createdTime).getTime() === new Date(note.modifiedTime).getTime()); // valid and equal
  });

  // active
  console.assert(items.active === null);

  // focus
  console.assert(items.focus === false);

  // newtab
  console.assert(items.newtab === false);

  // tab
  console.assert(items.tab === false);
};

const testCustomValues = () => {
  const items = migrate({}, {
    font: {
      id: "roboto-mono",
      name: "Roboto Mono",
      fontFamily: "\"Roboto Mono\"",
      href: "https://fonts.googleapis.com/css?family=Roboto+Mono:400,700&display=swap",
    },
    size: 340,
    theme: "dark",
    customTheme: "my custom theme css",
    notes: {
      Todo: {
        content: "buy milk",
        createdTime: "2020-04-20T09:02:00.000Z",
        modifiedTime: "2020-04-20T09:02:02.000Z",
        sync: {
          file: {
            id: "6073",
            name: "Todo",
            createdTime: "2020-04-20T09:02:00.000Z",
            modifiedTime: "2020-04-20T09:02:02.000Z",
          }
        }
      },
      Clipboard: {
        content: "Clipboard content",
        createdTime: "2020-04-20T09:07:00.000Z",
        modifiedTime: "2020-04-20T09:07:07.000Z",
        sync: {
          file: {
            id: "2931",
            name: "Clipboard",
            createdTime: "2020-04-20T09:07:00.000Z",
            modifiedTime: "2020-04-20T09:07:07.000Z",
          }
        }
      },
      Math: {
        content: "some equations",
        createdTime: "2020-04-20T09:09:00.000Z",
        modifiedTime: "2020-04-20T09:09:09.000Z",
      },
    },
    active: "Todo",
    focus: true,
    newtab: true,
    tab: true,
  });

  assertItems(items);

  // font
  console.assert(items.font.id === "roboto-mono");
  console.assert(items.font.name === "Roboto Mono");
  console.assert(items.font.fontFamily === "\"Roboto Mono\"");
  console.assert(items.font.href === "https://fonts.googleapis.com/css?family=Roboto+Mono:400,700&display=swap");
  console.assert(Object.keys(items.font).length === 4);

  // size
  console.assert(items.size === 340);

  // theme
  console.assert(items.theme === "dark");

  // customTheme
  console.assert(items.customTheme === "my custom theme css");

  // notes
  console.assert(Object.keys(items.notes).length === 3);

  // notes - Todo
  console.assert(items.notes.Todo.content === "buy milk");
  console.assert(items.notes.Todo.createdTime === "2020-04-20T09:02:00.000Z");
  console.assert(items.notes.Todo.modifiedTime === "2020-04-20T09:02:02.000Z");
  console.assert(items.notes.Todo.sync.file.id === "6073");
  console.assert(items.notes.Todo.sync.file.name === "Todo");
  console.assert(items.notes.Todo.sync.file.createdTime === "2020-04-20T09:02:00.000Z");
  console.assert(items.notes.Todo.sync.file.modifiedTime === "2020-04-20T09:02:02.000Z");

  // notes - Clipboard
  console.assert(items.notes.Clipboard.content === "Clipboard content");
  console.assert(items.notes.Clipboard.createdTime === "2020-04-20T09:07:00.000Z");
  console.assert(items.notes.Clipboard.modifiedTime === "2020-04-20T09:07:07.000Z");
  console.assert(items.notes.Clipboard.sync.file.id === "2931");
  console.assert(items.notes.Clipboard.sync.file.name === "Clipboard");
  console.assert(items.notes.Clipboard.sync.file.createdTime === "2020-04-20T09:07:00.000Z");
  console.assert(items.notes.Clipboard.sync.file.modifiedTime === "2020-04-20T09:07:07.000Z");

  // notes - Math
  console.assert(items.notes.Math.content === "some equations");
  console.assert(items.notes.Math.createdTime === "2020-04-20T09:09:00.000Z");
  console.assert(items.notes.Math.modifiedTime === "2020-04-20T09:09:09.000Z");
  console.assert("sync" in items.notes.Math === false);

  // active
  console.assert(items.active === "Todo");

  // focus
  console.assert(items.focus === true);

  // newtab
  console.assert(items.newtab === true);

  // tab
  console.assert(items.tab === true);
};

const testValidValues = () => { // any invalid value should fallback to a default
  const items = migrate({}, {
    font: {         // must be a valid "font" object
      name: "Droid Sans",
    },
    size: "large",  // must be number
    theme: "green", // must be "light" or "dark"
    customTheme: { background: "#ffffff" }, // must be string
    notes: null,    // must be object
    active: "Todo", // must be in "notes"
    focus: 1,       // must be boolean
    newtab: 1,      // must be boolean
    tab: 1,         // must be boolean
  });

  testDefaultValues(items); // every wrong attribute in "items" should fallback to a default
};

const testNotesMigration = () => {
  let items;

  // Migrate notes from [1.1.1], [1.1], [1.0] => [3.x]
  items = migrate({ newtab: "buy milk" }, {});
  console.assert(Object.keys(items.notes).length === 4);
  console.assert(items.notes.One.content === "buy milk");
  console.assert(items.notes.Two.content === "");
  console.assert(items.notes.Three.content === "");
  console.assert(items.notes.Clipboard.content === "");

  // Migrate notes from [1.4], [1.3], [1.2] => [3.x]
  items = migrate({ value: "buy coffee" }, {});
  console.assert(Object.keys(items.notes).length === 4);
  console.assert(items.notes.One.content === "buy coffee");
  console.assert(items.notes.Two.content === "");
  console.assert(items.notes.Three.content === "");
  console.assert(items.notes.Clipboard.content === "");

  // Migrate notes from newest [1.x] => [3.x]
  items = migrate({ newtab: "buy milk", value: "buy milk, buy coffee" }, {});
  console.assert(Object.keys(items.notes).length === 4);
  console.assert(items.notes.One.content === "buy milk, buy coffee");
  console.assert(items.notes.Two.content === "");
  console.assert(items.notes.Three.content === "");
  console.assert(items.notes.Clipboard.content === "");

  // Migrate notes from [2.0], [2.0.1], [2.0.2], [2.1] => [3.x]
  items = migrate({ notes: ["from page 1", "from page 2", "from page 3"] }, {});
  console.assert(Object.keys(items.notes).length === 4);
  console.assert(items.notes.One.content === "from page 1");
  console.assert(items.notes.Two.content === "from page 2");
  console.assert(items.notes.Three.content === "from page 3");
  console.assert(items.notes.Clipboard.content === "");

  // Migrate notes from [2.2] => [3.x]
  items = migrate({}, { notes: ["1", "2", "3"] });
  console.assert(Object.keys(items.notes).length === 4);
  console.assert(items.notes.One.content === "1");
  console.assert(items.notes.Two.content === "2");
  console.assert(items.notes.Three.content === "3");
  console.assert(items.notes.Clipboard.content === "");

  // Migrate notes from [3.0] => [3.x]
  items = migrate({}, {
    notes: {
      Todo: {
        content: "buy milk",
        createdTime: "2020-04-20T09:02:00.000Z",
        modifiedTime: "2020-04-20T09:02:02.000Z",
        sync: {
          file: {
            id: "6073",
            name: "Todo",
            createdTime: "2020-04-20T09:02:00.000Z",
            modifiedTime: "2020-04-20T09:02:02.000Z",
          }
        }
      },
      Clipboard: {
        content: "Clipboard content",
        createdTime: "2020-04-20T09:07:00.000Z",
        modifiedTime: "2020-04-20T09:07:07.000Z",
        sync: {
          file: {
            id: "2931",
            name: "Clipboard",
            createdTime: "2020-04-20T09:07:00.000Z",
            modifiedTime: "2020-04-20T09:07:07.000Z",
          }
        }
      },
      Math: {
        content: "some equations",
        createdTime: "2020-04-20T09:09:00.000Z",
        modifiedTime: "2020-04-20T09:09:09.000Z",
      },
    }
  });
  console.assert(Object.keys(items.notes).length === 3);

  // notes - Todo
  console.assert(items.notes.Todo.content === "buy milk");
  console.assert(items.notes.Todo.createdTime === "2020-04-20T09:02:00.000Z");
  console.assert(items.notes.Todo.modifiedTime === "2020-04-20T09:02:02.000Z");
  console.assert(items.notes.Todo.sync.file.id === "6073");
  console.assert(items.notes.Todo.sync.file.name === "Todo");
  console.assert(items.notes.Todo.sync.file.createdTime === "2020-04-20T09:02:00.000Z");
  console.assert(items.notes.Todo.sync.file.modifiedTime === "2020-04-20T09:02:02.000Z");

  // notes - Clipboard
  console.assert(items.notes.Clipboard.content === "Clipboard content");
  console.assert(items.notes.Clipboard.createdTime === "2020-04-20T09:07:00.000Z");
  console.assert(items.notes.Clipboard.modifiedTime === "2020-04-20T09:07:07.000Z");
  console.assert(items.notes.Clipboard.sync.file.id === "2931");
  console.assert(items.notes.Clipboard.sync.file.name === "Clipboard");
  console.assert(items.notes.Clipboard.sync.file.createdTime === "2020-04-20T09:07:00.000Z");
  console.assert(items.notes.Clipboard.sync.file.modifiedTime === "2020-04-20T09:07:07.000Z");

  // notes - Math
  console.assert(items.notes.Math.content === "some equations");
  console.assert(items.notes.Math.createdTime === "2020-04-20T09:09:00.000Z");
  console.assert(items.notes.Math.modifiedTime === "2020-04-20T09:09:09.000Z");
  console.assert("sync" in items.notes.Math === false);
};

runTests("background/init/migrations/__tests__/core.test.js", [
  testDefaultValues,
  testCustomValues,
  testValidValues,
  testNotesMigration,
]);
