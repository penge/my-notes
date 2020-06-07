/* global document */

import { modalTemplate } from "./view/elements.js";
import { isReserved } from "./reserved.js";

const removeModal = () => {
  const modal = document.getElementById("modal");
  modal && modal.remove();
};

const createModal = (captionValue, confirmValue, validate, onConfirm) => {
  removeModal();

  const node = modalTemplate.content.cloneNode(true);

  const caption = node.getElementById("caption"); caption.innerHTML = captionValue;
  const input = node.getElementById("input");
  const cancel = node.getElementById("cancel");
  const confirm = node.getElementById("confirm"); confirm.value = confirmValue;

  const action = () => {
    if (validate(input.value)) {
      removeModal();
      onConfirm(input.value);
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

  cancel.onclick = removeModal;

  document.body.appendChild(node);
};

export const insertImageModal = (onConfirm) => {
  createModal(
    "Image URL",
    "Insert",
    (inputValue) => inputValue.length > 0,
    onConfirm
  );
};

export const newNoteModal = (onConfirm) => {
  createModal(
    "New note",
    "Create",
    (inputValue) => inputValue.length > 0 && !isReserved(inputValue),
    onConfirm
  );
};
