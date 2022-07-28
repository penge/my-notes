import splitId, { SplitIdResult } from "../split-id";

type T = SplitIdResult<chrome.contextMenus.ContextType, "note" | "remote">;

test("splitId()", () => {
  expect(splitId("page-note-@clipboard")).toEqual<T>({
    context: "page",
    destination: "note",
    noteName: "@clipboard",
  });

  expect(splitId("page-note-Todo")).toEqual<T>({
    context: "page",
    destination: "note",
    noteName: "Todo",
  });

  expect(splitId("page-note-Tables and Chairs")).toEqual<T>({
    context: "page",
    destination: "note",
    noteName: "Tables and Chairs",
  });

  expect(splitId("page-note-npm-packages")).toEqual<T>({
    context: "page",
    destination: "note",
    noteName: "npm-packages",
  });

  expect(splitId("image-note-@images")).toEqual<T>({
    context: "image",
    destination: "note",
    noteName: "@images",
  });

  expect(splitId("selection-remote")).toEqual<T>({
    context: "selection",
    destination: "remote",
    noteName: "",
  });
});
