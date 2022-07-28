import { NotesObject } from "shared/storage/schema";
import { tString } from "i18n";
import isNoteLocked from "./is-note-locked";
import splitId from "./split-id";
import getTextToSave from "./get-text-to-save";
import {
  saveTextToLocalMyNotes,
  saveTextToRemotelyOpenMyNotes,
} from "../saving";
import { notify } from "../notifications";
import { CLIPBOARD_NOTE_NAME, IMAGES_NOTE_NAME } from "../reserved-note-names";

const ID = "my-notes";
const contexts: chrome.contextMenus.ContextType[] = ["page", "image", "selection"];

/**
 * Creates My Notes Context menu
 *
 * To use the Context menu, select a text on
 * a website and follow with a right-click
 *
 * Required permission: "contextMenus" (see manifest.json)
 */
const createContextMenu = (notes: NotesObject): string | number => chrome.contextMenus.create({
  id: ID,
  title: "My Notes",
  contexts,
}, () => contexts.forEach((context) => {
  const reservedNoteNames = [
    CLIPBOARD_NOTE_NAME,
    context === "image" ? IMAGES_NOTE_NAME : "",
  ].filter(Boolean);

  const nonReservedNoteNames = Object.keys(notes)
    .filter((noteName) => !reservedNoteNames.includes(noteName))
    .sort();

  const commonProperties: chrome.contextMenus.CreateProperties = {
    parentId: ID,
    contexts: [context],
  };

  const noteProperties = (noteName: string): chrome.contextMenus.CreateProperties => ({
    ...commonProperties,
    id: `${context}-note-${noteName}`,
    title: tString(`Context Menu.${context}-note.title`, { note: noteName }),
    enabled: !isNoteLocked(notes, noteName),
  });

  const separatorProperties = (suffix: string): chrome.contextMenus.CreateProperties => ({
    ...commonProperties,
    type: "separator",
    id: `${context}-separator-${suffix}`,
  });

  reservedNoteNames.forEach((noteName) => {
    chrome.contextMenus.create(noteProperties(noteName));
  });

  chrome.contextMenus.create(separatorProperties("first"));

  nonReservedNoteNames.forEach((noteName) => {
    chrome.contextMenus.create(noteProperties(noteName));
  });

  chrome.contextMenus.create(separatorProperties("second"));

  chrome.contextMenus.create({
    ...commonProperties,
    id: `${context}-remote`,
    title: tString(`Context Menu.${context}-remote.title`),
  });
}));

export const attachContextMenuOnClicked = (): void => chrome.contextMenus.onClicked.addListener((info) => {
  const { context, destination, noteName } = splitId<chrome.contextMenus.ContextType, "note" | "remote">(info.menuItemId.toString());
  const tKey = `Context Menu.${context}-${destination}.notification`;
  const textToSave = getTextToSave(context, info);
  if (!textToSave) {
    return;
  }

  if (destination === "note" && noteName) {
    saveTextToLocalMyNotes(textToSave, noteName);
    notify({
      notificationId: `note-${new Date().getTime()}-${noteName}`,
      message: tString(tKey, { note: noteName }),
    });
    return;
  }

  if (destination === "remote") {
    saveTextToRemotelyOpenMyNotes(textToSave);
    notify({
      notificationId: `remote-${new Date().getTime()}`,
      message: tString(tKey),
    });
  }
});

let currentNotesString: string;

const recreateContextMenuFromNotes = (notes: NotesObject | undefined): void => {
  if (!notes) {
    currentNotesString = "";
    chrome.contextMenus.removeAll();
    return;
  }

  const notesString = JSON.stringify(Object.keys(notes).map((noteName) => `${noteName}_${notes[noteName].locked}`));

  // re-create context menu only when note names have changed or their "locked" property
  if (notesString === currentNotesString) {
    return;
  }

  currentNotesString = notesString;

  chrome.contextMenus.removeAll(() => {
    createContextMenu(notes);
  });
};

export const createAndUpdateContextMenuFromNotes = (): void => {
  chrome.storage.local.get("notes", (local) => {
    recreateContextMenuFromNotes(local.notes);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.notes) {
      recreateContextMenuFromNotes(changes.notes.newValue);
    }
  });
};
