// Use to:
// - find "My Notes" folder, or
// - find "assets" folder inside "My Notes" folder
export const listFoldersQuery = (name: string, parent?: string): string =>
  `${parent ? `'${parent}' in parents and ` : ""}name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

// Use to:
// - get list of files in "My Notes" folder
export const listFilesQuery = (folderId: string): string =>
  `'${folderId}' in parents and mimeType='text/html' and trashed=false`;
