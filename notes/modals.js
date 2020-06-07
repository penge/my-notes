/* global document */

import { insertImageModalTemplate } from "./view/elements.js";

const removeModal = () => {
  const modal = document.getElementById("modal");
  modal && modal.remove();
};

export const insertImageModal = (callback) => {
  const node = insertImageModalTemplate.content.cloneNode(true);

  const url = node.getElementById("image-url");
  const confirm = node.getElementById("confirm");
  const cancel = node.getElementById("cancel");

  confirm.onclick = (event) => {
    event.preventDefault();
    if (url.value.length > 0) {
      removeModal();
      callback(url.value);
    }
  };

  url.onkeyup = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      confirm.click();
    }
  };

  cancel.onclick = removeModal;

  document.body.appendChild(node);
};
