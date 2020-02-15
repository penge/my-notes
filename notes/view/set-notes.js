/* global document */

/**
 * Renders an array of notes into #existing-notes as [.note-tile, .note-tile, ...]
 * Used template: #note-tile-template
 */

import { existingNotes, noteTileTemplate } from "./elements.js";
import { isReserved } from "../reserved.js";
import attachOptions from "./attach-options.js";

const createNoteTile = (name, content, { activateNote, renameNote, deleteNote }) => {
  const template = noteTileTemplate.content.cloneNode(true);
  const noteTile = template.children[0];

  // Note name
  const noteName = noteTile.getElementsByClassName("note-name")[0];
  noteName.classList.toggle("reserved", isReserved(name));
  noteName.innerText = name;

  // Note content
  const noteContent = noteTile.getElementsByClassName("note-content")[0];
  noteContent.innerHTML = content;

  // Open note
  noteTile.addEventListener("click", (event) => {
    if (["note-tile", "note-name", "note-options"].includes(event.target.className)) {
      activateNote(name);
    }
  });

  // Open options
  const noteOptions = noteTile.getElementsByClassName("note-options")[0];
  attachOptions(name, { noteOptions, noteTile, renameNote, deleteNote });

  return noteTile;
};

export default function setNotes(notesObject, { activateNote, renameNote, deleteNote }) {
  const fragment = document.createDocumentFragment();
  let noteNames = Object.keys(notesObject);

  // Add all note tiles to the fragment
  for (const name of noteNames) {
    const content = notesObject[name].content;
    const noteTile = createNoteTile(name, content, { activateNote, renameNote, deleteNote });
    fragment.appendChild(noteTile);
  }

  // Render note tiles to <div id="existing-notes"></div>
  existingNotes.innerHTML = "";
  existingNotes.appendChild(fragment);
}
