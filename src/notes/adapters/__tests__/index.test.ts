import { NotesObject, NotesOrder } from "shared/storage/schema";
import { notesToSidebarNotes } from "../";

describe("notesToSidebarNotes()", () => {
  describe("unpinned notes only", () => {
    it("returns notes in correct order", () => {
      const notes: NotesObject = {
        Todo: {
          content: "my todo",
          createdTime: "CT-TODO",
          modifiedTime: "MT-TODO",
        },
        Article: {
          content: "my article",
          createdTime: "CT-ARTICLE",
          modifiedTime: "MT-ARTICLE",
        },
        Shopping: {
          content: "my shopping",
          createdTime: "CT-SHOPPING",
          modifiedTime: "MT-SHOPPING",
        },
      };

      const sidebarNotes = notesToSidebarNotes(notes, NotesOrder.Alphabetical);
      expect(sidebarNotes).toEqual([
        { name: "Article", ...notes.Article },
        { name: "Shopping", ...notes.Shopping },
        { name: "Todo", ...notes.Todo },
      ]);
    });
  });

  describe("pinned and unpinned notes", () => {
    it("returns notes in correct order", () => {
      const notes: NotesObject = {
        Todo: {
          content: "my todo",
          createdTime: "CT-TODO",
          modifiedTime: "MT-3",
        },
        Shopping: {
          content: "my shopping",
          createdTime: "CT-SHOPPING",
          modifiedTime: "MT-9",
          pinnedTime: "PT-SHOPPING",
        },
        Article: {
          content: "my article",
          createdTime: "CT-ARTICLE",
          modifiedTime: "MT-2",
        },
        Clipboard: {
          content: "my clipboard",
          createdTime: "CT-CLIPBOARD",
          modifiedTime: "MT-8",
          pinnedTime: "PT-CLIPBOARD",
        },
      };

      const sidebarNotes = notesToSidebarNotes(notes, NotesOrder.Alphabetical);
      expect(sidebarNotes).toEqual([
        { name: "Clipboard", ...notes.Clipboard },
        { name: "Shopping", ...notes.Shopping },

        { name: "Article", ...notes.Article },
        { name: "Todo", ...notes.Todo },
      ]);

      const sidebarNotes2 = notesToSidebarNotes(notes, NotesOrder.NewestFirst);
      expect(sidebarNotes2).toEqual([
        { name: "Shopping", ...notes.Shopping },
        { name: "Clipboard", ...notes.Clipboard },

        { name: "Todo", ...notes.Todo },
        { name: "Article", ...notes.Article },
      ]);

      const sidebarNotes3 = notesToSidebarNotes(notes, NotesOrder.Custom, ["Shopping", "Article"]);
      expect(sidebarNotes3).toEqual([
        { name: "Clipboard", ...notes.Clipboard },
        { name: "Shopping", ...notes.Shopping },

        { name: "Todo", ...notes.Todo },
        { name: "Article", ...notes.Article },
      ]);

      const sidebarNotes4 = notesToSidebarNotes(notes, NotesOrder.Custom, []);
      expect(sidebarNotes4).toEqual([
        { name: "Shopping", ...notes.Shopping },
        { name: "Clipboard", ...notes.Clipboard },

        { name: "Todo", ...notes.Todo },
        { name: "Article", ...notes.Article },
      ]);
    });
  });
});
