/* global document */

import state from "./state/index.js";
import range from "./range.js";

import { contextMenu, renameAction, deleteAction } from "./view/elements.js";
import { renameNoteModal, deleteNoteModal } from "./modals.js";
import { isReserved } from "./reserved.js";

const hide = () => {
  if (!document.body.classList.contains("with-context-menu")) {
    return;
  }
  document.body.classList.remove("with-context-menu");
  range.restore();
};

const show = (x, y, noteName) => {
  if (isReserved(noteName)) {
    return;
  }

  range.save();

  contextMenu.style.left = x + "px";
  contextMenu.style.top = `calc(${y}px + 1em)`;

  renameAction.onclick = () => {
    renameNoteModal(noteName, (newName) => {
      state.renameNote(noteName, newName);
    });
  };

  deleteAction.onclick = () => {
    deleteNoteModal(noteName, () => {
      state.deleteNote(noteName);
    });
  };

  document.body.classList.add("with-context-menu");
};

export default { hide, show };
