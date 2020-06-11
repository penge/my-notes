/* global document */

import { closeDropdowns } from "./dropdown.js";
import { removeModal } from "../modals.js";

import { panel, notes, content, toolbar } from "./elements.js";
import { hide, show } from "./visibility.js";

export default function setPage(pageName) {
  document.body.style.opacity = 0;

  closeDropdowns();
  removeModal();

  hide(panel);
  hide(notes);
  hide(content);
  hide(toolbar);

  if (pageName === "notes") {
    document.title = "My Notes";
    show(notes);
  }

  if (pageName === "content") {
    show(panel);
    show(content);
    show(toolbar);
  }

  document.body.style.opacity = 1;
}
