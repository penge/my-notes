import { NotesObject } from "shared/storage/schema";
import { tString } from "i18n";
import { getUrlToSave, getSelectionToSave } from "./content";
import {
  saveTextToLocalMyNotes,
  saveTextToRemotelyOpenMyNotes,
  CLIPBOARD_NOTE_NAME,
} from "../saving";
import { notify } from "../notifications";

const ID = "my-notes";

const MY_NOTES_SAVE_URL_TO_NOTE_PREFIX = "my-notes-save-url-to-note-";
const MY_NOTES_SAVE_URL_TO_REMOTE = "my-notes-save-url-to-remote";

const MY_NOTES_SAVE_SELECTION_TO_NOTE_PREFIX = "my-notes-save-selection-to-note-";
const MY_NOTES_SAVE_SELECTION_TO_REMOTE = "my-notes-save-selection-to-remote";

const isLocked = (notes: NotesObject, noteName: string): boolean => !!(notes[noteName]?.locked);

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
  contexts: ["page", "selection"],
}, () => {
  const noteCreateProperties = ({ context, prefix, noteName, tKey }: { context: chrome.contextMenus.ContextType, prefix: string, noteName: string, tKey: string }): chrome.contextMenus.CreateProperties => ({
    parentId: ID,
    id: `${prefix}${noteName}`,
    title: tString(tKey, { note: noteName }),
    contexts: [context],
    enabled: !isLocked(notes, noteName),
  });

  const remoteCreateProperties = (context: chrome.contextMenus.ContextType, id: string, tKey: string): chrome.contextMenus.CreateProperties => ({
    parentId: ID,
    id,
    title: tString(tKey),
    contexts: [context],
  });

  const separatorCreateProperties = (context: chrome.contextMenus.ContextType, id: string): chrome.contextMenus.CreateProperties => ({
    parentId: ID,
    id: `my-notes-${context}-separator-${id}`,
    type: "separator",
    contexts: [context],
  });

  const forEveryNote = (callback: (noteName: string) => void) => Object.keys(notes).sort().forEach(callback);

  /* ------------- page ------------- */
  const pageContext: chrome.contextMenus.ContextType = "page";
  const saveUrlToNoteCreateProperties = (noteName: string): chrome.contextMenus.CreateProperties =>
    noteCreateProperties({
      context: pageContext,
      prefix: MY_NOTES_SAVE_URL_TO_NOTE_PREFIX,
      noteName,
      tKey: "Context Menu.menus.Save URL to",
    });
  chrome.contextMenus.create(saveUrlToNoteCreateProperties(CLIPBOARD_NOTE_NAME));
  chrome.contextMenus.create(separatorCreateProperties(pageContext, "one"));
  forEveryNote((noteName) => {
    chrome.contextMenus.create(saveUrlToNoteCreateProperties(noteName));
  });
  chrome.contextMenus.create(separatorCreateProperties(pageContext, "two"));
  chrome.contextMenus.create(remoteCreateProperties(
    pageContext,
    MY_NOTES_SAVE_URL_TO_REMOTE,
    "Context Menu.menus.Save URL to remotely open My Notes",
  ));

  /* ------------- selection ------------- */
  const selectionContext: chrome.contextMenus.ContextType = "selection";
  const saveSelectionToNoteCreateProperties = (noteName: string): chrome.contextMenus.CreateProperties =>
    noteCreateProperties({
      context: selectionContext,
      prefix: MY_NOTES_SAVE_SELECTION_TO_NOTE_PREFIX,
      noteName,
      tKey: "Context Menu.menus.Save to",
    });

  chrome.contextMenus.create(saveSelectionToNoteCreateProperties(CLIPBOARD_NOTE_NAME));
  chrome.contextMenus.create(separatorCreateProperties(selectionContext, "one"));
  forEveryNote((noteName) => {
    chrome.contextMenus.create(saveSelectionToNoteCreateProperties(noteName));
  });
  chrome.contextMenus.create(separatorCreateProperties(selectionContext, "two"));
  chrome.contextMenus.create(remoteCreateProperties(
    selectionContext,
    MY_NOTES_SAVE_SELECTION_TO_REMOTE,
    "Context Menu.menus.Save to remotely open My Notes",
  ));
});

let currentNotesString: string;

export const attachContextMenuOnClicked = (): void => chrome.contextMenus.onClicked.addListener((info) => {
  const menuId: string = info.menuItemId.toString();

  if (menuId.startsWith(MY_NOTES_SAVE_URL_TO_NOTE_PREFIX)) {
    const destinationNoteName = menuId.replace(MY_NOTES_SAVE_URL_TO_NOTE_PREFIX, "");
    const urlToSave = getUrlToSave(info);
    saveTextToLocalMyNotes(urlToSave, destinationNoteName);

    notify(tString("Context Menu.notifications.Saved URL to", { note: destinationNoteName }));
    return;
  }

  if (menuId === MY_NOTES_SAVE_URL_TO_REMOTE) {
    const urlToSave = getUrlToSave(info);
    saveTextToRemotelyOpenMyNotes(urlToSave);

    notify(tString("Context Menu.notifications.Sent URL to remotely open My Notes"));
    return;
  }

  if (menuId.startsWith(MY_NOTES_SAVE_SELECTION_TO_NOTE_PREFIX)) {
    const destinationNoteName = menuId.replace(MY_NOTES_SAVE_SELECTION_TO_NOTE_PREFIX, "");
    const selectionToSave = getSelectionToSave(info);
    saveTextToLocalMyNotes(selectionToSave, destinationNoteName);

    notify(tString("Context Menu.notifications.Saved text to", { note: destinationNoteName }));
    return;
  }

  if (menuId === MY_NOTES_SAVE_SELECTION_TO_REMOTE) {
    const selectionToSave = getSelectionToSave(info);
    saveTextToRemotelyOpenMyNotes(selectionToSave);

    notify(tString("Context Menu.notifications.Sent text to remotely open My Notes"));
    return;
  }
});

const recreateContextMenuFromNotes = (notes: NotesObject): void => {
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
    recreateContextMenuFromNotes(local.notes as NotesObject);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes["notes"]) {
      recreateContextMenuFromNotes(changes.notes.newValue as NotesObject);
    }
  });
};
