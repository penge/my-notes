import { readTextFile, ReadTextFileResponse } from "./read-text-file";
import { readZipFile } from "./read-zip-file";

export const ACCEPTED_TEXT_TYPES: readonly string[] = ["text/plain", "text/html"];
export const ACCEPTED_ZIP_TYPE = "application/zip" as const;

const importNotes = (responses: ReadTextFileResponse[]): Promise<string[]> => new Promise((resolve) => {
  chrome.storage.local.get("notes", (local) => {
    const sortedImportableResponses = responses.sort((a, b) => a.name.localeCompare(b.name)).filter((response) => !(response.name in local.notes));
    if (!sortedImportableResponses.length) {
      resolve([]);
      return;
    }

    const { notes } = local;
    sortedImportableResponses.forEach((response) => {
      notes[response.name] = response.note;
    });

    chrome.storage.local.set({ notes }, () => {
      const importedNoteNames = sortedImportableResponses.map((response) => response.name);
      resolve(importedNoteNames);
    });
  });
});

export const importNoteFromTextFile = async (file: File): Promise<boolean> => {
  if (!ACCEPTED_TEXT_TYPES.includes(file.type)) {
    return false;
  }

  const response = await readTextFile(file);
  if (!response) {
    return false;
  }

  const importedNotes = await importNotes([response]);
  return importedNotes.length === 1;
};

export const importNotesFromTextFiles = async (fileList: FileList): Promise<string[]> => {
  const files = Array.from(fileList).filter((file) => ACCEPTED_TEXT_TYPES.includes(file.type));
  if (!files.length) {
    return [];
  }

  const textFileResponses = await Promise.all(files.map(readTextFile));
  const readTextFileResponses = (textFileResponses.filter((response) => response !== null) as ReadTextFileResponse[]);

  return importNotes(readTextFileResponses);
};

export const importNotesFromZipFile = async (file: File): Promise<string[]> => {
  if (file.type !== ACCEPTED_ZIP_TYPE) {
    return [];
  }

  const zipFileResponse = await readZipFile(file);

  return importNotes(zipFileResponse);
};
