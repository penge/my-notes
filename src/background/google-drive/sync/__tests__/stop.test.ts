import { unlinkNotes } from "../stop";

const notes = {
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
      },
    },
  },

  Radio: {
    content: "some radio stations",
    createdTime: "2020-04-20T09:05:00Z",
    modifiedTime: "2020-04-20T09:05:05Z",
  },

  Todo: {
    content: "buy milk, buy coffee",
    createdTime: "2020-04-20T09:02:00Z",
    modifiedTime: "2020-04-20T09:02:07Z",
    sync: {
      file: {
        id: "6073",
        name: "Todo",
        createdTime: "2020-04-20T09:02:00Z",
        modifiedTime: "2020-04-20T09:02:02Z",
      },
    },
  },
};

it("unlinks all notes", () => {
  const unlinkedNotes = unlinkNotes(notes);

  expect(Object.keys(unlinkedNotes).length).toBe(3);

  // Clipboard
  expect(unlinkedNotes.Clipboard.content).toBe("Clipboard content");
  expect(unlinkedNotes.Clipboard.createdTime).toBe("2020-04-20T09:07:00Z");
  expect(unlinkedNotes.Clipboard.modifiedTime).toBe("2020-04-20T09:07:07Z");
  expect("sync" in unlinkedNotes.Clipboard).toBe(false);

  // Radio
  expect(unlinkedNotes.Radio.content).toBe("some radio stations");
  expect(unlinkedNotes.Radio.createdTime).toBe("2020-04-20T09:05:00Z");
  expect(unlinkedNotes.Radio.modifiedTime).toBe("2020-04-20T09:05:05Z");
  expect("sync" in unlinkedNotes.Radio).toBe(false);

  // Todo
  expect(unlinkedNotes.Todo.content).toBe("buy milk, buy coffee");
  expect(unlinkedNotes.Todo.createdTime).toBe("2020-04-20T09:02:00Z");
  expect(unlinkedNotes.Todo.modifiedTime).toBe("2020-04-20T09:02:07Z");
  expect("sync" in unlinkedNotes.Todo).toBe(false);
});
