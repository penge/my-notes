import migrate from "../core";

it("migrates data", () => {
  let items;

  // Migrate notes from [1.1.1], [1.1], [1.0] => [3.x]
  items = migrate({ newtab: "buy milk" }, {});
  expect(Object.keys(items.notes).length).toBe(4);
  expect(items.notes.One.content).toBe("buy milk");
  expect(items.notes.Two.content).toBe("");
  expect(items.notes.Three.content).toBe("");
  expect(items.notes.Clipboard.content).toBe("");

  // Migrate notes from [1.4], [1.3], [1.2] => [3.x]
  items = migrate({ value: "buy coffee" }, {});
  expect(Object.keys(items.notes).length).toBe(4);
  expect(items.notes.One.content).toBe("buy coffee");
  expect(items.notes.Two.content).toBe("");
  expect(items.notes.Three.content).toBe("");
  expect(items.notes.Clipboard.content).toBe("");

  // Migrate notes from newest [1.x] => [3.x]
  items = migrate({ newtab: "buy milk", value: "buy milk, buy coffee" }, {});
  expect(Object.keys(items.notes).length).toBe(4);
  expect(items.notes.One.content).toBe("buy milk, buy coffee");
  expect(items.notes.Two.content).toBe("");
  expect(items.notes.Three.content).toBe("");
  expect(items.notes.Clipboard.content).toBe("");

  // Migrate notes from [2.0], [2.0.1], [2.0.2], [2.1] => [3.x]
  items = migrate({ notes: ["from page 1", "from page 2", "from page 3"] }, {});
  expect(Object.keys(items.notes).length === 4);
  expect(items.notes.One.content === "from page 1");
  expect(items.notes.Two.content === "from page 2");
  expect(items.notes.Three.content === "from page 3");
  expect(items.notes.Clipboard.content === "");

  // Migrate notes from [2.2] => [3.x]
  items = migrate({}, { notes: ["1", "2", "3"] });
  expect(Object.keys(items.notes).length).toBe(4);
  expect(items.notes.One.content).toBe("1");
  expect(items.notes.Two.content).toBe("2");
  expect(items.notes.Three.content).toBe("3");
  expect(items.notes.Clipboard.content).toBe("");

  // Migrate notes from [3.0] => [3.x]
  const local = {
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
  };
  items = migrate({}, local);
  expect(Object.keys(items.notes).length).toBe(3); // Todo, Clipboard, Math

  expect(items.notes.Todo).toEqual(local.notes.Todo);
  expect(items.notes.Clipboard).toEqual(local.notes.Clipboard);
  expect(items.notes.Math).toEqual(local.notes.Math);
});
