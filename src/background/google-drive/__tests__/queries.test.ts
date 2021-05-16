import {
  listFoldersQuery,
  listFilesQuery,
} from "../queries";

test("listFoldersQuery() returns query string to find My Notes folder", () => {
  const query = listFoldersQuery("My Notes");
  expect(query).toBe("name='My Notes' and mimeType='application/vnd.google-apps.folder' and trashed=false");
});

test("listFoldersQuery() returns query string to find assets folder inside My Notes folder", () => {
  const query = listFoldersQuery("assets", "12345");
  expect(query).toBe("'12345' in parents and name='assets' and mimeType='application/vnd.google-apps.folder' and trashed=false");
});

test("listFilesQuery() returns query string to find notes inside My Notes folder", () => {
  const query = listFilesQuery("12345");
  expect(query).toBe("'12345' in parents and mimeType='text/html' and trashed=false");
});
