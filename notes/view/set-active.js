/* global window, document, setTimeout */

import { content } from "./elements.js";

const autofocus = () => {
  setTimeout(() => {
    const selection = window.getSelection();

    const range = document.createRange();
    range.setStart(content, 0);
    range.setEnd(content, 0);

    selection.removeAllRanges();
    selection.addRange(range);
  });
};

const setActiveInSidebar = (name) => {
  const notes = document.querySelectorAll("#sidebar-notes .note");
  notes.forEach(note => {
    note.classList.toggle("active", note.innerText === name);
  });
};

export default function setActive(name, html) {
  document.title = name;

  content.innerHTML = html;

  setActiveInSidebar(name);
  autofocus();
}
