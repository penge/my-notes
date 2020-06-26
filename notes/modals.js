/* global document, setTimeout */

import state from "./state/index.js";
import { modalTemplate } from "./view/elements.js";
import { isReserved } from "./reserved.js";
import range from "./range.js";

const removeModal = (onRemove) => {
  const modal = document.getElementById("modal");
  if (!modal) {
    return false;
  }
  modal.remove();
  onRemove && onRemove();
  document.body.classList.remove("with-modal", "with-overlay", "to-rename", "to-create", "to-delete");
  range.restore();
  return true;
};

const createModal = ({ clazz, overlay, captionValue, inputValue, cancelValue, confirmValue, validate, onConfirm, onRemove }) => {
  removeModal();
  range.save();

  const node = modalTemplate.content.cloneNode(true);
  const modal = node.children[0];
  if (clazz) {
    modal.className = clazz;
  }

  const caption = node.getElementById("caption"); if (captionValue) { caption.innerHTML = captionValue; } else { caption.className = "hide"; }
  const input = node.getElementById("input"); if (typeof inputValue === "string") { input.value = inputValue; } else { input.className = "hide"; }
  const cancel = node.getElementById("cancel"); if (cancelValue) { cancel.value = cancelValue; }
  const confirm = node.getElementById("confirm"); if (confirmValue) { confirm.value = confirmValue; }

  const action = () => {
    const valid = validate ? validate(input.value) : true;
    if (valid) {
      removeModal(onRemove);
      setTimeout(() => {
        onConfirm(input ? input.value : undefined);
      }, 0);
    }
  };

  confirm.onclick = (event) => {
    event.preventDefault();
    action();
  };

  input.onkeyup = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      action();
    }
  };

  cancel.onclick = () => {
    removeModal(onRemove);
  };

  document.body.classList.add("with-modal");
  if (overlay) { document.body.classList.add("with-overlay", overlay); }
  document.body.prepend(node);

  input.focus();
  input.onblur = () => {
    input.focus();
  };
};

export const insertImageModal = (onConfirm) => {
  createModal({
    clazz: "with-border",
    captionValue: "Image URL",
    inputValue: "",
    confirmValue: "Insert",
    validate: (inputValue) => inputValue.length > 0,
    onConfirm,
  });
};

export const insertLinkModal = (onConfirm) => {
  createModal({
    clazz: "with-border",
    captionValue: "Link URL",
    inputValue: "",
    confirmValue: "Insert",
    validate: (inputValue) => inputValue.length > 0,
    onConfirm,
  });
};

export const newNoteModal = (onConfirm) => {
  createModal({
    overlay: "to-create",
    captionValue: "New note",
    inputValue: "",
    confirmValue: "Create",
    validate: (inputValue) => inputValue.length > 0 && !isReserved(inputValue) && !(inputValue in state.notes),
    onConfirm,
  });
};

export const renameNoteModal = (currentName, onConfirm, onRemove) => {
  createModal({
    overlay: "to-rename",
    captionValue: null,
    confirmValue: "Rename",
    inputValue: currentName,
    validate: (inputValue) => inputValue.length > 0 && inputValue !== currentName && !isReserved(inputValue) && !(inputValue in state.notes),
    onConfirm,
    onRemove,
  });
};

export const deleteNoteModal = (noteName, onConfirm, onRemove) => {
  createModal({
    overlay: "to-delete",
    captionValue: `Delete ${noteName}?`,
    inputValue: null,
    cancelValue: "No",
    confirmValue: "Yes",
    onConfirm,
    onRemove,
  });
};
