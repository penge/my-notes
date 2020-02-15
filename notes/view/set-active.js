/* global document */

import { noteName, noteOptions, content } from "./elements.js";
import { isReserved } from "../reserved.js";
import attachOptions from "./attach-options.js";

export default function setActive(name, html, { renameNote, deleteNote }) {
  document.title = name;

  noteName.innerText = name;
  noteName.classList.toggle("reserved", isReserved(name));

  content.innerHTML = html;

  attachOptions(name, { noteOptions, renameNote, deleteNote });
}
