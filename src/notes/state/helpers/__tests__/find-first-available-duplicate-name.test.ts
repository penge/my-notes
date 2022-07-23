import findFirstAvailableDuplicateName from "../find-first-available-duplicate-name";

describe("findFirstAvailableDuplicateName()", () => {
  describe("there is note name to duplicate", () => {
    it("returns first available duplicate name", () => {
      expect(
        findFirstAvailableDuplicateName(["todo", "article", "clipboard"], "article"),
      ).toBe("article (2)");

      expect(
        findFirstAvailableDuplicateName(["todo", "article", "article (2)", "clipboard"], "article (2)"),
      ).toBe("article (3)");

      expect(
        findFirstAvailableDuplicateName(["todo", "article", "article (2)", "article (3)", "clipboard"], "article (2)"),
      ).toBe("article (4)");

      expect(
        findFirstAvailableDuplicateName(["todo", "article", "article (2)", "article (3)", "clipboard"], "article"),
      ).toBe("article (4)");

      expect(
        findFirstAvailableDuplicateName(["todo", "article", "article (2)", "article (4)", "article (5)", "article (6)", "clipboard"], "article"),
      ).toBe("article (3)");

      expect(
        findFirstAvailableDuplicateName(["todo", "article", "article (2)", "article (4)", "article (5)", "article (6)", "clipboard"], "article (4)"),
      ).toBe("article (7)");

      expect(
        findFirstAvailableDuplicateName(["todo", "article (99)"], "article (99)"),
      ).toBe("article (100)");

      expect(
        findFirstAvailableDuplicateName(["todo", "article (100)"], "article (100)"),
      ).toBe("article (100) (2)");

      expect(
        findFirstAvailableDuplicateName(["todo", "article", "article(2)"], "article"),
      ).toBe("article (2)");

      expect(
        findFirstAvailableDuplicateName(["todo", "article", "article(2)"], "article(2)"),
      ).toBe("article(3)");

      expect(
        findFirstAvailableDuplicateName(["todo", "article", "article (2)", "article (10.10)", "clipboard"], "article (10.10)"),
      ).toBe("article (10.10) (2)");

      expect(
        findFirstAvailableDuplicateName(["todo", "(10)", "clipboard"], "(10)"),
      ).toBe("(10) (2)");
    });
  });

  describe("there is NO note name to duplicate", () => {
    it("returns an empty string", () => {
      expect(findFirstAvailableDuplicateName([], "article")).toBe("");
      expect(findFirstAvailableDuplicateName(["todo"], "article")).toBe("");
    });
  });
});
