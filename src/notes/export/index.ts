import { zipSync, Zippable } from "fflate";
import { NotesObject } from "shared/storage/schema";
import { downloadBlob } from "shared/download";

export const exportNote = (noteName: string): void => chrome.storage.local.get("notes", (local) => {
  const { notes } = local as { notes: NotesObject };
  if (!(noteName in notes)) {
    return; // there is no note to export
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(notes[noteName].content);

  downloadBlob(data, `${noteName}.html`, "text/html");
});

export const exportNotes = (): void => chrome.storage.local.get("notes", (local) => {
  const { notes } = local as { notes: NotesObject };
  if (!Object.keys(notes).length) {
    return; // there are no notes to export
  }

  const encoder = new TextEncoder();
  const data: Zippable = Object.keys(notes).reduce((acc, curr) => {
    acc[`${curr}.html`] = encoder.encode(notes[curr].content);
    return acc;
  }, {} as Zippable);

  const gzipped = zipSync(data, { level: 0 });
  downloadBlob(gzipped, "notes.zip", "application/zip");
});
