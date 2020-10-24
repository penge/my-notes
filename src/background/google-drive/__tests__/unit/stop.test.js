/* global console */

import { unlinkNotes } from "../../sync/stop.js";
import runTests from "../../../../tests/run-tests.js";

const notes = {
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

  Radio: {
    content: "some radio stations",
    createdTime: "2020-04-20T09:05:00.000Z",
    modifiedTime: "2020-04-20T09:05:05.000Z",
  },

  Todo: {
    content: "buy milk, buy coffee",
    createdTime: "2020-04-20T09:02:00.000Z",
    modifiedTime: "2020-04-20T09:02:07.000Z",
    sync: {
      file: {
        id: "6073",
        name: "Todo",
        createdTime: "2020-04-20T09:02:00.000Z",
        modifiedTime: "2020-04-20T09:02:02.000Z",
      }
    }
  },
};

const test = () => {
  const unlinkedNotes = unlinkNotes(notes);

  console.assert(Object.keys(unlinkedNotes).length === 3);

  // Clipboard
  console.assert(unlinkedNotes.Clipboard.content === "Clipboard content");
  console.assert(unlinkedNotes.Clipboard.createdTime === "2020-04-20T09:07:00.000Z");
  console.assert(unlinkedNotes.Clipboard.modifiedTime === "2020-04-20T09:07:07.000Z");
  console.assert("sync" in unlinkedNotes.Clipboard === false);

  // Radio
  console.assert(unlinkedNotes.Radio.content === "some radio stations");
  console.assert(unlinkedNotes.Radio.createdTime === "2020-04-20T09:05:00.000Z");
  console.assert(unlinkedNotes.Radio.modifiedTime === "2020-04-20T09:05:05.000Z");
  console.assert("sync" in unlinkedNotes.Radio === false);

  // Todo
  console.assert(unlinkedNotes.Todo.content === "buy milk, buy coffee");
  console.assert(unlinkedNotes.Todo.createdTime === "2020-04-20T09:02:00.000Z");
  console.assert(unlinkedNotes.Todo.modifiedTime === "2020-04-20T09:02:07.000Z");
  console.assert("sync" in unlinkedNotes.Todo === false);
};

runTests("background/google-drive/__tests__/unit/stop.test.js", [
  test,
]);
