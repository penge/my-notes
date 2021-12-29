import { nameFilter } from "../read-zip-file";

test("filter() filters to only importable files (txt, html)", () => {
  const files = [
    "__MACOSX/.Article.txt",
    "__MACOSX/.TODO.txt",
    "Article.txt",
    "TODO.TXT",
    "image.png",
    ".hidden",
    "Clipboard.html",
    "News.txt",
    "COOKING.TXT",
  ];

  const filteredFiles = files.filter(nameFilter);
  expect(filteredFiles).toEqual([
    "Article.txt",
    "TODO.TXT",
    "Clipboard.html",
    "News.txt",
    "COOKING.TXT",
  ]);
});
