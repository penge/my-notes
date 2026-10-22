import { listFiles } from "../api";
import * as files from "../files";

jest.mock("../files");

const list = files.list as jest.MockedFunction<typeof files.list>;

const file = (id: string) => ({
  id, name: `Note ${id}`, createdTime: "2020-04-20T09:00:00Z", modifiedTime: "2020-04-20T09:00:00Z",
});

beforeEach(() => list.mockReset());

test("listFiles() returns files from a single page", async () => {
  list.mockResolvedValueOnce({ files: [file("1"), file("2")] });

  const result = await listFiles("folder");

  expect(result).toEqual([file("1"), file("2")]);
  expect(list).toHaveBeenCalledTimes(1);
  expect(list).toHaveBeenCalledWith(expect.any(String), expect.stringContaining("nextPageToken"), 1000, undefined);
});

test("listFiles() follows nextPageToken until every page is retrieved", async () => {
  list
    .mockResolvedValueOnce({ files: [file("1")], nextPageToken: "page-2" })
    .mockResolvedValueOnce({ files: [], nextPageToken: "page-3" }) // Google Drive can return an empty page before the end
    .mockResolvedValueOnce({ files: [file("2"), file("3")] });

  const result = await listFiles("folder");

  expect(result).toEqual([file("1"), file("2"), file("3")]);
  expect(list).toHaveBeenCalledTimes(3);
  expect(list).toHaveBeenNthCalledWith(2, expect.any(String), expect.any(String), 1000, "page-2");
  expect(list).toHaveBeenNthCalledWith(3, expect.any(String), expect.any(String), 1000, "page-3");
});

test("listFiles() returns undefined if any page cannot be retrieved", async () => {
  list
    .mockResolvedValueOnce({ files: [file("1")], nextPageToken: "page-2" })
    .mockResolvedValueOnce({ error: { code: 500 } });

  const result = await listFiles("folder");

  expect(result).toBeUndefined();
});

test("listFiles() returns undefined if the request failed", async () => {
  list.mockResolvedValueOnce(undefined);

  const result = await listFiles("folder");

  expect(result).toBeUndefined();
});
