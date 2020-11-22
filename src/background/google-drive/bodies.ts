export const createFolderBody = (folderName: string): string => `
--my-notes
Content-Type: application/json; charset=UTF-8

{
  "name": "${folderName}",
  "mimeType": "application/vnd.google-apps.folder"
}

--my-notes--`;

export interface CreateFileBodyOptions {
  name: string
  content: string
  createdTime: string
  modifiedTime: string
}

export const createFileBody = (
  parent: string, { name, content, createdTime, modifiedTime }: CreateFileBodyOptions
): string => `
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

export interface UpdateFileBodyOptions {
  name: string
  content: string
  modifiedTime: string
}

export const updateFileBody = (
  { name, content, modifiedTime }: UpdateFileBodyOptions
): string => `
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
