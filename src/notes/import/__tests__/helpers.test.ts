import { removeExtension, getExtension } from "../helpers";

test("removeExtension() removes extension", () => {
  expect(removeExtension("Article.txt")).toBe("Article");
  expect(removeExtension("Article")).toBe("");
});

test("getExtension() gets extension", () => {
  expect(getExtension("Article.txt")).toBe("txt");
  expect(getExtension("Article.TXT")).toBe("TXT");
  expect(getExtension("Article")).toBe("");
  expect(getExtension(".hidden")).toBe("");
  expect(getExtension("")).toBe("");
});
