/* global document */

import { modalTemplate } from "./view/elements.js";
import { isReserved } from "./reserved.js";

export const removeModal = (onRemove) => {
  const modal = document.getElementById("modal");
  if (!modal) {
    return;
  }
  modal.remove();
  onRemove && onRemove();
};

const createModal = ({ clazz, captionValue, cancelValue, confirmValue, inputValue, validate, onConfirm, onRemove, noInput }) => {
  removeModal();

  const node = modalTemplate.content.cloneNode(true);
  const modal = node.children[0];
  modal.className = clazz;

  const caption = node.getElementById("caption"); caption.innerHTML = captionValue;
  const input = node.getElementById("input"); if (inputValue) { input.value = inputValue; } if (noInput) { input.className = "hide"; }
  const cancel = node.getElementById("cancel"); if (cancelValue) { cancel.value = cancelValue; }
  const confirm = node.getElementById("confirm"); if (confirmValue) { confirm.value = confirmValue; }

  const action = () => {
    const valid = validate ? validate(input.value) : true;
    if (valid) {
      removeModal(onRemove);
      onConfirm(input ? input.value : undefined);
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

  cancel.onclick = () => { removeModal(onRemove); };

  document.body.appendChild(node);
  if (input) {
    input.focus();
  }
};

export const insertImageModal = (onConfirm) => {
  createModal({
    clazz: "center",
    captionValue: "Image URL",
    confirmValue: "Insert",
    validate: (inputValue) => inputValue.length > 0,
    onConfirm,
  });
};

export const newNoteModal = (onConfirm) => {
  createModal({
    clazz: "top",
    captionValue: "New note",
    confirmValue: "Create",
    validate: (inputValue) => inputValue.length > 0 && !isReserved(inputValue),
    onConfirm,
  });
};

export const renameNoteModal = (currentName, onConfirm, onRemove) => {
  createModal({
    clazz: "top",
    captionValue: "New name",
    confirmValue: "Rename",
    inputValue: currentName,
    validate: (inputValue) => inputValue.length > 0 && inputValue !== currentName && !isReserved(inputValue),
    onConfirm,
    onRemove,
  });
};

export const deleteNoteModal = (noteName, onConfirm, onRemove) => {
  createModal({
    clazz: "top",
    captionValue: `Delete ${noteName}?`,
    cancelValue: "No",
    confirmValue: "Yes",
    onConfirm,
    onRemove,
    noInput: true,
  });
};
