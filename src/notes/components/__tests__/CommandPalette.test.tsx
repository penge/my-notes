import { NotesObject } from "shared/storage/schema";
import { Filter, FilterType, prepareFilter, prepareItems } from "../CommandPalette";

describe("prepareFilter", () => {
  it("detects CommandsByName filter", () => {
    expect(prepareFilter(" >   time ")).toEqual<Filter>({
      type: FilterType.CommandsByName,
      input: "time",
    });

    expect(prepareFilter(" >   current time ")).toEqual<Filter>({
      type: FilterType.CommandsByName,
      input: "current time",
    });
  });

  it("detects NotesByContent filter", () => {
    expect(prepareFilter("   ?  muffins ")).toEqual<Filter>({
      type: FilterType.NotesByContent,
      input: "muffins",
    });

    expect(prepareFilter("   ?  best ever muffins ")).toEqual<Filter>({
      type: FilterType.NotesByContent,
      input: "best ever muffins",
    });
  });

  it("detects NotesByName filter", () => {
    expect(prepareFilter("   TODO ")).toEqual<Filter>({
      type: FilterType.NotesByName,
      input: "todo",
    });
  });
});

describe("prepareItems", () => {
  const createdTime = "CT"; // not relevant for the test
  const modifiedTime = "MT"; // not relevant for the test

  const notes: NotesObject = {
    Clipboard: {
      content: "",
      createdTime,
      modifiedTime,
    },
    Article: {
      content: "This is an interesting article",
      createdTime,
      modifiedTime,
    },
    TODO: {
      content: "buy milk, buy coffee",
      createdTime,
      modifiedTime,
    },
  };

  const commands = [
    "Insert current Date",
    "Insert current Time",
    "Insert current Date and Time",
  ];

  it("returns notes by default", () => {
    const items = prepareItems(notes, commands, undefined);
    expect(items).toEqual([
      "Clipboard",
      "Article",
      "TODO",
    ]);
  });

  describe("CommandsByName filter", () => {
    it("returns commands that include input in their name", () => {
      const filter: Filter = { type: FilterType.CommandsByName, input: "date" };
      const items = prepareItems(notes, commands, filter);
      expect(items).toEqual([
        "Insert current Date",
        "Insert current Date and Time",
      ]);
    });

    it("returns all commands when no input is provided", () => {
      const filter: Filter = { type: FilterType.CommandsByName, input: "   " };
      const items = prepareItems(notes, commands, filter);
      expect(items).toEqual(commands);
    });
  });

  describe("NotesByContent filter", () => {
    it("returns notes that include input in their content", () => {
      const filter: Filter = { type: FilterType.NotesByContent, input: "interesting" };
      const items = prepareItems(notes, commands, filter);
      expect(items).toEqual([
        "Article",
      ]);
    });

    it("returns all notes when no input is provided", () => {
      const filter: Filter = { type: FilterType.NotesByContent, input: "   " };
      const items = prepareItems(notes, commands, filter);
      expect(items).toEqual([
        "Clipboard",
        "Article",
        "TODO",
      ]);
    });
  });

  describe("NotesByName filter", () => {
    it("returns notes that include input in their name", () => {
      const filter: Filter = { type: FilterType.NotesByName, input: "ar" };
      const items = prepareItems(notes, commands, filter);
      expect(items).toEqual([
        "Clipboard",
        "Article",
      ]);
    });

    it("returns all notes when no input is provided", () => {
      const filter: Filter = { type: FilterType.NotesByName, input: "   " };
      const items = prepareItems(notes, commands, filter);
      expect(items).toEqual([
        "Clipboard",
        "Article",
        "TODO",
      ]);
    });
  });
});
