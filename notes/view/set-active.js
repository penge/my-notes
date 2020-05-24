/* global document, setTimeout */

import { noteName, noteOptions, content } from "./elements.js";
import { isReserved } from "../reserved.js";
import attachOptions from "./attach-options.js";

export default function setActive(name, html, { renameNote, deleteNote }) {
  document.title = name;

  noteName.innerText = name;
  noteName.classList.toggle("reserved", isReserved(name));

  content.style.caretColor = "transparent";
  content.innerHTML = html;
  setTimeout(function() {
    content.focus();
    document.execCommand("selectAll", false, null);
    document.getSelection().collapseToEnd();
    content.style.caretColor = "";
  }, 0);

  attachOptions(name, { noteOptions, renameNote, deleteNote });
}
