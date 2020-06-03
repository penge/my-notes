/* global document */

import edit from "./edit.js";
import { changeStyle } from "./view/dom.js";

const get = id => document.getElementById(id);

export const exec = (command, value = null) =>
  document.execCommand(command, false, value);

const controls = [
  [get("B"), () => exec("bold")],
  [get("I"), () => exec("italic")],
  [get("U"), () => exec("underline")],
  [get("S"), () => exec("strikeThrough")],

  [get("H2"), () => exec("formatBlock", "<h2>")],
  [get("H3"), () => exec("formatBlock", "<h3>")],
  [get("P"), () => exec("formatBlock", "<p>")],
  [get("HR"), () => exec("insertHorizontalRule")],
  [get("UL"), () => exec("insertUnorderedList")],
  [get("OL"), () => exec("insertOrderedList")],

  [get("CL"), () => exec("justifyLeft")],
  [get("CC"), () => exec("justifyCenter")],
  [get("CR"), () => exec("justifyRight")],
  [get("RTL"), () => changeStyle({'direction': 'rtl', 'text-align': 'right'})],
  [get("LTR"), () => changeStyle({'direction': 'ltr', 'text-align': 'left' })],
];

const initialize = (content, tabId) => {
  for (const control of controls) {
    const [element, handler] = control;
    element.addEventListener("click", () => {
      handler() && edit(content, tabId);
    });
  }
};

export default { initialize };
