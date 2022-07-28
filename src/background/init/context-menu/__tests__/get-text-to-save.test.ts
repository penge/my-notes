import getTextToSave from "../get-text-to-save";

const irrelevant: Pick<chrome.contextMenus.OnClickData, "menuItemId" | "editable"> = {
  menuItemId: "",
  editable: true,
};

describe("getTextToSave()", () => {
  describe("page context", () => {
    it("returns url to save", () => {
      expect(getTextToSave("page", {
        ...irrelevant,
        pageUrl: "https://github.com/penge/my-notes",
      })).toBe('<a href="https://github.com/penge/my-notes" target="_blank">https://github.com/penge/my-notes</a>'
        + "<br><br>");
    });
  });

  describe("image context", () => {
    it("returns img to save", () => {
      expect(getTextToSave("image", {
        ...irrelevant,
        pageUrl: "https://domain.com",
        srcUrl: "https://domain.com/image.png",
      })).toBe('<img src="https://domain.com/image.png">'
        + "<br><br>");
    });
  });

  describe("selection context", () => {
    it("returns selection to save", () => {
      expect(getTextToSave("selection", {
        ...irrelevant,
        pageUrl: "https://articles.com/good-article",
        selectionText: "Text selected from the article...",
      })).toBe("Text selected from the article...<br>"
        + '<b>(<a href="https://articles.com/good-article" target="_blank">https://articles.com/good-article</a>)</b>'
        + "<br><br>");
    });
  });
});
