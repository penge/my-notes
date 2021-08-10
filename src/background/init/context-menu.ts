import { Log } from "shared/logger";
import { NotesObject } from "shared/storage/schema";
import {
  saveTextToLocalMyNotes,
  saveTextToRemotelyOpenMyNotes,
} from "./saving";

const ID = "my-notes";
const contexts = ["selection"];

const MY_NOTES_SAVE_TO_NOTE_PREFIX = "my-notes-save-to-note-";
const MY_NOTES_SAVE_TO_REMOTE = "my-notes-save-to-remote";

const getTextToSave = (info: chrome.contextMenus.OnClickData) => {
  const { pageUrl, selectionText } = info;
  const pageUrlLink = pageUrl.startsWith("http") ? `<a href="${pageUrl}" target="_blank">${pageUrl}</a>` : pageUrl;
  const textToSave = `${selectionText}<br><b>(${pageUrlLink})</b><br><br>`;
  return textToSave;
};

/**
 * Creates My Notes Context menu
 *
 * To use the Context menu, select a text on
 * a website and follow with a right-click
 *
 * Required permission: "contextMenus" (see manifest.json)
 */
const createContextMenu = (notes: NotesObject): void => {
  chrome.contextMenus.create({
    id: ID,
    title: "My Notes",
    contexts,
  }, () => {
    Object.keys(notes).sort().forEach((noteName) => {
      chrome.contextMenus.create({
        parentId: ID,
        id: `${MY_NOTES_SAVE_TO_NOTE_PREFIX}${noteName}`,
        title: `Save to ${noteName}`,
        contexts,
        enabled: notes[noteName].locked !== true,
      });
    });
    chrome.contextMenus.create({
      parentId: ID,
      id: "my-notes-separator",
      type: "separator",
      contexts,
    });
    chrome.contextMenus.create({
      parentId: ID,
      id: MY_NOTES_SAVE_TO_REMOTE,
      title: "Save to remotely open My Notes",
      contexts,
    });
  });
};

let currentNotesString: string;

export const attachContextMenuOnClicked = (): void => chrome.contextMenus.onClicked.addListener((info) => {
  const menuId: string = info.menuItemId.toString();
  const textToSave = getTextToSave(info);

  if (menuId.startsWith(MY_NOTES_SAVE_TO_NOTE_PREFIX)) {
    const destinationNoteName = menuId.replace(MY_NOTES_SAVE_TO_NOTE_PREFIX, "");
    Log(`Context menu is saving text to ${destinationNoteName}`);
    saveTextToLocalMyNotes(textToSave, destinationNoteName);
    return;
  }

  if (info.menuItemId === MY_NOTES_SAVE_TO_REMOTE) {
    Log("Context menu is saving text to be picked up by the remotely open My Notes");
    saveTextToRemotelyOpenMyNotes(textToSave);
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
