/* global document */

import { isReserved } from "../reserved.js";
import { closeDropdown, closeDropdowns } from "./dropdown.js";
import { showOverlay, removeOverlay } from "./overlay.js";
import { renameNoteModal, deleteNoteModal } from "../modals.js";

export const reset = () => {
  const tiles = document.getElementsByClassName("note-tile in-action");
  if (tiles.length === 1) {
    tiles[0].classList.remove("to-rename", "to-delete", "in-action");
  }
  removeOverlay();
};

export default function attachOptions(noteName, { noteOptions, noteTile, renameNote, deleteNote }) {
  if (isReserved(noteName)) {
    noteOptions.classList.add("hide");
    return;
  } else {
    noteOptions.classList.remove("hide");
  }

  const useOverlay = typeof noteTile === "undefined";
  const useTile = typeof noteTile !== "undefined";

  const toggle = noteOptions.getElementsByClassName("dropdown-toggle")[0];
  const dropdown = noteOptions.getElementsByClassName("dropdown")[0];

  const renameAction = dropdown.getElementsByClassName("rename")[0];
  const deleteAction = dropdown.getElementsByClassName("delete")[0];

  toggle.onclick = () => {
    const isOpen = dropdown.classList.contains("open");
    closeDropdowns();
    dropdown.classList.toggle("open", !isOpen);
  };

  const callAction = (clazz, handler) => {
    closeDropdown(dropdown);
    if (useTile) { noteTile.classList.add(clazz, "in-action"); }
    if (useOverlay) { showOverlay(clazz); }
    handler();
  };

  renameAction.onclick = () => {
    callAction("to-rename", () => {
      renameNoteModal(noteName, (newName) => { renameNote(noteName, newName); }, reset);
    });
  };

  deleteAction.onclick = () => {
    callAction("to-delete", () => {
      deleteNoteModal(noteName, () => { deleteNote(noteName); }, reset);
    });
  };
}
