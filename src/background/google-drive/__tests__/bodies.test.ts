import {
  createFolderBody,
  createFileBody,
  updateFileBody,
  uploadFileBody,
} from "../bodies";


it("has valid create folder body", () => expect(createFolderBody("My Notes")).toEqual(`
--my-notes
Content-Type: application/json; charset=UTF-8

{
  "parents": [],
  "name": "My Notes",
  "mimeType": "application/vnd.google-apps.folder"
}

--my-notes--`));


it("has valid create folder body with parent", () => expect(createFolderBody("assets", "PARENT_ID")).toEqual(`
--my-notes
Content-Type: application/json; charset=UTF-8

{
  "parents": ["PARENT_ID"],
  "name": "assets",
  "mimeType": "application/vnd.google-apps.folder"
}

--my-notes--`));


it("has valid create file body", () => expect(createFileBody("12345", {
  name: "Todo",
  content: "buy milk",
  createdTime: "CT",
  modifiedTime: "MT"
})).toEqual(`
--my-notes
Content-Type: application/json; charset=UTF-8

{
  "parents": ["12345"],
  "name": "Todo",
  "createdTime": "CT",
  "modifiedTime": "MT"
}

--my-notes
Content-Type: text/html

buy milk

--my-notes--`));


it("has valid update file body", () => expect(updateFileBody({
  name: "Todo Today",
  content: "buy milk, buy coffee",
  modifiedTime: "MT"
})).toEqual(`
--my-notes
Content-Type: application/json; charset=UTF-8

{
  "name": "Todo Today",
  "modifiedTime": "MT"
}

--my-notes
Content-Type: text/html

buy milk, buy coffee

--my-notes--`));


it("has valid upload file body", () => expect(uploadFileBody("12345", {
  name: "image.jpeg",
  type: "image/jpeg",
  content: "IMAGE_CONTENT",
  createdTime: "CT",
  modifiedTime: "MT"
})).toEqual(`
--my-notes
Content-Type: application/json; charset=UTF-8

{
  "parents": ["12345"],
  "name": "image.jpeg",
  "createdTime": "CT",
  "modifiedTime": "MT"
}

--my-notes
Content-Type: image/jpeg
Content-Transfer-Encoding: base64

IMAGE_CONTENT

--my-notes--`));
