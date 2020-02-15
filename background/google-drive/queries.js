// Use to find My Notes folder
export const listFoldersQuery = (name) =>
  `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

// Use to get list of files in My Notes folder
export const listFilesQuery = (folderId) =>
  `'${folderId}' in parents and mimeType='text/html' and trashed=false`;
