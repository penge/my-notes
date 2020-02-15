/* global document, window, prompt */

import { isReserved } from "../reserved.js";
import { closeDropdown, closeDropdowns } from "./dropdown.js";
import { showOverlay, removeOverlay } from "./overlay.js";

const reset = ({ noteTile }) => {
  if (noteTile) {
    noteTile.classList.remove("to-rename");
    noteTile.classList.remove("to-delete");
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

  renameAction.onclick = () => {
    function callback() {
      closeDropdown(dropdown);
      if (useTile) {
        if (noteTile && !noteTile.classList.contains("to-rename")) {
          noteTile.classList.add("to-rename");
          window.requestAnimationFrame(callback);
          return;
        }
      }
      if (useOverlay) {
        const overlay = document.getElementById("overlay");
        if (!overlay || !overlay.classList.contains("to-rename")) {
          showOverlay("to-rename");
          window.requestAnimationFrame(callback);
          return;
        }
      }
      const newName = prompt("Type a new unique name:", noteName);
      reset({ noteTile });
      if (newName && newName !== noteName) {
        renameNote(noteName, newName);
      }
    }
    window.requestAnimationFrame(callback);
  };

  deleteAction.onclick = () => {
    function callback() {
      closeDropdown(dropdown);
      if (useTile) {
        if (noteTile && !noteTile.classList.contains("to-delete")) {
          noteTile.classList.add("to-delete");
          window.requestAnimationFrame(callback);
          return;
        }
      }
      if (useOverlay) {
        const overlay = document.getElementById("overlay");
        if (!overlay || !overlay.classList.contains("to-delete")) {
          showOverlay("to-delete");
          window.requestAnimationFrame(callback);
          return;
        }
      }
      const answer = prompt(`Are you sure you want to delete "${noteName}"?\r\n\r\nType "delete" to confirm.`);
      reset({ noteTile });
      if (answer === "delete") {
        deleteNote(noteName);
      }
    }
    window.requestAnimationFrame(callback);
  };
}
