import { Note, NotesObject, NotesOrder } from "shared/storage/schema";
import * as sortNotes from "notes/sort";
import { notesToSidebarNotes, SidebarNote } from "..";

const notRelevant: Pick<Note, "createdTime" | "modifiedTime"> = {
  createdTime: "",
  modifiedTime: "",
};

const notes: NotesObject = {
  Todo: {
    content: "my todo",
    ...notRelevant,
  },
  Shopping: {
    content: "my shopping",
    ...notRelevant,
    pinnedTime: "PT-2",
  },
  Article: {
    content: "my article",
    ...notRelevant,
  },
  Clipboard: {
    content: "my clipboard",
    ...notRelevant,
    pinnedTime: "PT-1",
  },
};

describe("notesToSidebarNotes()", () => {
  it("returns notes in correct order", () => {
    const sidebarNotes = notesToSidebarNotes(notes, NotesOrder.Alphabetical);
    expect(sidebarNotes).toEqual([
      { name: "Clipboard", ...notes.Clipboard },
      { name: "Shopping", ...notes.Shopping },

      { name: "Article", ...notes.Article },
      { name: "Todo", ...notes.Todo },
    ]);
  });

  describe("dependency on sortNotes()", () => {
    const expectedNotesArgument: SidebarNote[] = [
      { name: "Todo", ...notes.Todo },
      { name: "Shopping", ...notes.Shopping },
      { name: "Article", ...notes.Article },
      { name: "Clipboard", ...notes.Clipboard },
    ];

    const dummyReturn: SidebarNote[] = [{
      name: "dummy", ...notes.Todo,
    }];

    it("calls sortNotes() with correct arguments", () => {
      const spy = jest.spyOn(sortNotes, "default").mockReturnValue(dummyReturn);

      const scenarios: Array<[NotesObject, NotesOrder, string[] | undefined]> = [
        [notes, NotesOrder.Alphabetical, undefined],
        [notes, NotesOrder.LatestCreated, undefined],
        [notes, NotesOrder.LatestModified, undefined],
        [notes, NotesOrder.Custom, ["Shopping", "Article"]],
      ];

      scenarios.forEach((scenario) => {
        const returnValue = notesToSidebarNotes(...scenario);
        expect(spy).toHaveBeenCalledWith(expectedNotesArgument, scenario[1], scenario[2]);
        expect(returnValue).toEqual(dummyReturn);
      });
    });
  });
});
