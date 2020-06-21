/* global document */

import { sidebarNotes } from "./elements.js";
import contextmenu from "../context-menu.js";

const createSidebarNote = (noteName, { activeNote, activateNote }) => {
  const oneNote = document.createElement("div");
  oneNote.className = "note";
  oneNote.innerText = noteName;

  if (noteName === activeNote) {
    oneNote.classList.add("active");
  }

  oneNote.addEventListener("click", () => {
    activateNote(noteName);
  });

  oneNote.addEventListener("mouseenter", () => {
    oneNote.classList.add("over");
    if (document.body.classList.contains("with-command") && !document.body.classList.contains("with-modal")) {
      activateNote(noteName);
    }
  });

  oneNote.addEventListener("mouseleave", () => {
    oneNote.classList.remove("over");
  });

  oneNote.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    contextmenu.hide();
    activateNote(noteName);

    const x = event.pageX;
    const y = event.pageY;

    contextmenu.show(x, y, noteName);
  });

  return oneNote;
};

export default function setNotes(notesObject, { activeNote, activateNote }) {
  const sidebarNotesFragment = document.createDocumentFragment();

  for (const noteName of Object.keys(notesObject)) {
    const sidebarNote = createSidebarNote(noteName, { activeNote, activateNote });
    sidebarNotesFragment.appendChild(sidebarNote);
  }

  // <div id="sidebar-notes"></div>
  sidebarNotes.innerHTML = "";
  sidebarNotes.appendChild(sidebarNotesFragment);
}
