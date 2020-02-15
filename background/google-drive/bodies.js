export const createFolderBody = (folderName) => `
--my-notes
Content-Type: application/json; charset=UTF-8

{
  "name": "${folderName}",
  "mimeType": "application/vnd.google-apps.folder"
}

--my-notes--`;


export const createFileBody = (
  parent, { name, content, createdTime, modifiedTime }
) => `
--my-notes
Content-Type: application/json; charset=UTF-8

{
  "parents": ["${parent}"],
  "name": "${name}",
  "createdTime": "${createdTime}",
  "modifiedTime": "${modifiedTime}"
}

--my-notes
Content-Type: text/html

${content}

--my-notes--`;


export const updateFileBody = (
  { name, content, modifiedTime }
) => `
--my-notes
Content-Type: application/json; charset=UTF-8

{
  "name": "${name}",
  "modifiedTime": "${modifiedTime}"
}

--my-notes
Content-Type: text/html

${content}

--my-notes--`;
