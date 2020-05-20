/* global console */

import {
  createFolderBody,
  createFileBody,
  updateFileBody,
} from "../../bodies.js";


const CFOLDER = createFolderBody("My Notes");
console.assert(CFOLDER === `
--my-notes
Content-Type: application/json; charset=UTF-8

{
  "name": "My Notes",
  "mimeType": "application/vnd.google-apps.folder"
}

--my-notes--`);


const CFILE = createFileBody("12345", {
  name: "Todo",
  content: "buy milk",
  createdTime: "CT",
  modifiedTime: "MT"
});
console.assert(CFILE === `
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

--my-notes--`);


const UFILE = updateFileBody({
  name: "Todo Today",
  content: "buy milk, buy coffee",
  modifiedTime: "MT"
});
console.assert(UFILE === `
--my-notes
Content-Type: application/json; charset=UTF-8

{
  "name": "Todo Today",
  "modifiedTime": "MT"
}

--my-notes
Content-Type: text/html

buy milk, buy coffee

--my-notes--`);
