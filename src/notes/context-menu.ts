import state from "./state/index";
import range from "./range";

import { contextMenu, renameAction, deleteAction } from "./view/elements";
import { renameNoteModal, deleteNoteModal } from "./modals";
import { isReserved } from "./reserved";

const hide = (): void => {
  if (!document.body.classList.contains("with-context-menu")) {
    return;
  }
  document.body.classList.remove("with-context-menu");
  range.restore();
};

const show = (x: number, y: number, noteName: string): void => {
  if (isReserved(noteName)) {
    return;
  }

  range.save();

  contextMenu.style.left = x + "px";
  contextMenu.style.top = `calc(${y}px + 1em)`;

  renameAction.onclick = () => {
    renameNoteModal(noteName, (newName: string) => {
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
