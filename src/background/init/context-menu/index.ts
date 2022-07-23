import { NotesObject } from "shared/storage/schema";
import { tString } from "i18n";
import { getTextToSave } from "./context";
import {
  CLIPBOARD_NOTE_NAME,
  saveTextToLocalMyNotes,
  saveTextToRemotelyOpenMyNotes,
} from "../saving";
import { notify } from "../notifications";

const ID = "my-notes";

const PAGE_NOTE_PREFIX = "page-note-";
const PAGE_REMOTE_MY_NOTES = "page-remote-my-notes";

const SELECTION_NOTE_PREFIX = "selection-note-";
const SELECTION_REMOTE_MY_NOTES = "selection-remote-my-notes";

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
  const forEveryNoteExceptClipboard = (callback: (noteName: string) => void) => {
    Object.keys(notes).filter(noteName => noteName !== CLIPBOARD_NOTE_NAME).sort().forEach(callback);
  };

  /* -------------< page >------------- */

  const pageCommonProperties: chrome.contextMenus.CreateProperties = {
    parentId: ID,
    contexts: ["page"],
  };

  chrome.contextMenus.create({
    ...pageCommonProperties,
    id: [PAGE_NOTE_PREFIX, CLIPBOARD_NOTE_NAME].join(""),
    title: tString("Context Menu.menus.Save URL to", { note: CLIPBOARD_NOTE_NAME }),
    enabled: !isLocked(notes, CLIPBOARD_NOTE_NAME),
  });

  chrome.contextMenus.create({
    ...pageCommonProperties,
    type: "separator",
    id: "page-separator-one",
  });

  forEveryNoteExceptClipboard((noteName) => {
    chrome.contextMenus.create({
      ...pageCommonProperties,
      id: [PAGE_NOTE_PREFIX, noteName].join(""),
      title: tString("Context Menu.menus.Save URL to", { note: noteName }),
      enabled: !isLocked(notes, noteName),
    });
  });

  chrome.contextMenus.create({
    ...pageCommonProperties,
    type: "separator",
    id: "page-separator-two",
  });

  chrome.contextMenus.create({
    ...pageCommonProperties,
    id: PAGE_REMOTE_MY_NOTES,
    title: tString("Context Menu.menus.Save URL to remotely open My Notes"),
  });

  /* -------------< selection >------------- */

  const selectionCommonProperties: chrome.contextMenus.CreateProperties = {
    parentId: ID,
    contexts: ["selection"],
  };

  chrome.contextMenus.create({
    ...selectionCommonProperties,
    id: [SELECTION_NOTE_PREFIX, CLIPBOARD_NOTE_NAME].join(""),
    title: tString("Context Menu.menus.Save to", { note: CLIPBOARD_NOTE_NAME }),
    enabled: !isLocked(notes, CLIPBOARD_NOTE_NAME),
  });

  chrome.contextMenus.create({
    ...selectionCommonProperties,
    type: "separator",
    id: "selection-separator-one",
  });

  forEveryNoteExceptClipboard((noteName) => {
    chrome.contextMenus.create({
      ...selectionCommonProperties,
      id: [SELECTION_NOTE_PREFIX, noteName].join(""),
      title: tString("Context Menu.menus.Save to", { note: noteName }),
      enabled: !isLocked(notes, noteName),
    });
  });

  chrome.contextMenus.create({
    ...selectionCommonProperties,
    type: "separator",
    id: "selection-separator-two",
  });

  chrome.contextMenus.create({
    ...selectionCommonProperties,
    id: SELECTION_REMOTE_MY_NOTES,
    title: tString("Context Menu.menus.Save to remotely open My Notes"),
  });
});

let currentNotesString: string;

export const attachContextMenuOnClicked = (): void => chrome.contextMenus.onClicked.addListener((info) => {
  const menuId: string = info.menuItemId.toString();
  const context = menuId.split("-")[0] as chrome.contextMenus.ContextType;
  const textToSave = getTextToSave(context, info);
  if (!textToSave) {
    return;
  }

  /* -------------< page >------------- */

  if (menuId.startsWith(PAGE_NOTE_PREFIX)) {
    const noteName = menuId.replace(PAGE_NOTE_PREFIX, "");
    saveTextToLocalMyNotes(textToSave, noteName);
    notify(tString("Context Menu.notifications.Saved URL to", { note: noteName }));
    return;
  }

  if (menuId === PAGE_REMOTE_MY_NOTES) {
    saveTextToRemotelyOpenMyNotes(textToSave);
    notify(tString("Context Menu.notifications.Sent URL to remotely open My Notes"));
    return;
  }

  /* -------------< selection >------------- */

  if (menuId.startsWith(SELECTION_NOTE_PREFIX)) {
    const noteName = menuId.replace(SELECTION_NOTE_PREFIX, "");
    saveTextToLocalMyNotes(textToSave, noteName);
    notify(tString("Context Menu.notifications.Saved text to", { note: noteName }));
    return;
  }

  if (menuId === SELECTION_REMOTE_MY_NOTES) {
    saveTextToRemotelyOpenMyNotes(textToSave);
    notify(tString("Context Menu.notifications.Sent text to remotely open My Notes"));
    return;
  }
});

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
    recreateContextMenuFromNotes(local.notes as NotesObject);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes["notes"]) {
      recreateContextMenuFromNotes(changes.notes.newValue);
    }
  });
};
