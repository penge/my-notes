/* global document */

import edit from "./edit.js";
import { insertImageModal } from "./modals.js";

const get = id => document.getElementById(id);

export const exec = (command, value = null) =>
  document.execCommand(command, false, value);

const commands = [
  [get("B"), (cb) => { exec("bold"); cb(); }],
  [get("I"), (cb) => { exec("italic"); cb(); }],
  [get("U"), (cb) => { exec("underline"); cb(); }],
  [get("S"), (cb) => { exec("strikeThrough"); cb(); }],

  [get("UL"), (cb) => { exec("insertUnorderedList"); cb(); }],
  [get("OL"), (cb) => { exec("insertOrderedList"); cb(); }],

  [get("CL"), (cb) => { exec("justifyLeft"); cb(); }],
  [get("CC"), (cb) => { exec("justifyCenter"); cb(); }],
  [get("CR"), (cb) => { exec("justifyRight"); cb(); }],

  [get("IMG"), (cb) => {
    insertImageModal((url) => {
      exec("insertImage", url);
      cb();
    });
  }],
];

const initialize = (content, tabId) => {
  for (const command of commands) {
    const [element, handler] = command;
    element.addEventListener("click", () => {
      handler(() => {
        edit(content, tabId);
      });
    });
  }
};

export default { initialize };
