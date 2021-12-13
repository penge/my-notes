import { NotesObject, NotesOrder } from "shared/storage/schema";
import { notesToSidebarNotes } from "../";

test("notesToSidebarNotes() returns notes suitable for the Sidebar", () => {
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
