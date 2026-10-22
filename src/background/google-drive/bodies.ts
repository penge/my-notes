export const createFolderBody = (folderName: string, parent?: string): string => `
--my-notes
Content-Type: application/json; charset=UTF-8

{
  "parents": ${parent ? `["${parent}"]` : "[]"},
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

// Metadata is serialized with JSON.stringify, so a note or file name with a
// quote, backslash or line break still produces valid JSON
const metadata = (fields: Record<string, unknown>): string => JSON.stringify(fields, null, 2);

export const createFileBody = (
  parent: string,
  {
    name, content, createdTime, modifiedTime,
  }: CreateFileBodyOptions,
): string => `
--my-notes
Content-Type: application/json; charset=UTF-8

${metadata({
    parents: [parent], name, createdTime, modifiedTime,
  })}

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
  { name, content, modifiedTime }: UpdateFileBodyOptions,
): string => `
--my-notes
Content-Type: application/json; charset=UTF-8

${metadata({ name, modifiedTime })}

--my-notes
Content-Type: text/html

${content}

--my-notes--`;

export interface UploadFileBodyOptions extends CreateFileBodyOptions {
  type: string
}

export const uploadFileBody = (
  parent: string,
  {
    name, type, content, createdTime, modifiedTime,
  }: UploadFileBodyOptions,
): string => `
--my-notes
Content-Type: application/json; charset=UTF-8

${metadata({
    parents: [parent], name, createdTime, modifiedTime,
  })}

--my-notes
Content-Type: ${type}
Content-Transfer-Encoding: base64

${content}

--my-notes--`;
