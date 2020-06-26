/* global document */

import edit from "./edit.js";
import { insertImageModal, insertLinkModal } from "./modals.js";
import { getRange, getNodes } from "./content.js";

const get = id => document.getElementById(id);

export const exec = (command, value = null) =>
  document.execCommand(command, false, value);

const HIGHLIGHT_CLASS = "my-notes-highlight";

const createSpan = (text, clazz) => {
  const span = document.createElement("span");
  span.innerText = text;
  span.className = clazz;
  return span;
};

const commands = [
  [get("B"), (cb) => { exec("bold"); cb(); }],
  [get("I"), (cb) => { exec("italic"); cb(); }],
  [get("U"), (cb) => { exec("underline"); cb(); }],
  [get("S"), (cb) => { exec("strikeThrough"); cb(); }],

  [get("H1"), (cb) => { exec("formatBlock", "<H1>"); cb(); }],
  [get("H2"), (cb) => { exec("formatBlock", "<H2>"); cb(); }],
  [get("H3"), (cb) => { exec("formatBlock", "<H3>"); cb(); }],

  [get("UL"), (cb) => { exec("insertUnorderedList"); cb(); }],
  [get("OL"), (cb) => { exec("insertOrderedList"); cb(); }],

  [get("CL"), (cb) => { exec("justifyLeft"); cb(); }],
  [get("CC"), (cb) => { exec("justifyCenter"); cb(); }],
  [get("CR"), (cb) => { exec("justifyRight"); cb(); }],

  [get("IMG"), (cb) => {
    insertImageModal((src) => {
      exec("insertImage", src);
      cb();
    });
  }],

  [get("LINK"), (cb) => {
    insertLinkModal((href) => {
      exec("createLink", href);
      cb();
    });
  }],

  [get("PRE"), (cb) => {
    exec("formatBlock", "<PRE>");
    cb();
  }],

  [get("HIGH"), (cb) => {
    const range = getRange();
    const nodes = getNodes(range);
    for (const node of nodes) {
      const value = node.nodeValue;

      // Split value in 3 parts
      const before = value.substring(0, range.startOffset);
      const selected = value.substring(range.startOffset, range.endOffset);
      const after = value.substring(range.endOffset);

      // Stop if no text is selected
      if (!selected) {
        continue;
      }

      // Parent (replace parent if already highlighted)
      const parent = node.parentNode;
      const parentHigh = parent.classList.contains(HIGHLIGHT_CLASS);

      // New nodes (keep before and after highlighted; highlight selected or invert it)
      let newNodes = [];
      if (before) { newNodes.push(parentHigh ? createSpan(before, HIGHLIGHT_CLASS) : before); }
      if (selected) { newNodes.push(parentHigh ? selected : createSpan(selected, HIGHLIGHT_CLASS)); }
      if (after) { newNodes.push(parentHigh ? createSpan(after, HIGHLIGHT_CLASS) : after); }

      (parentHigh ? parent : node).replaceWith(...newNodes);
      document.getSelection().empty();
    }
    cb();
  }],

  [get("RF"), (cb) => {
    exec("removeFormat");
    exec("formatBlock", "<DIV>");
    cb();
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
