/* global chrome, document */

import { toolbar } from "../view/elements.js";
import { insertImageModal, insertLinkModal } from "../modals.js";

import edit from "../edit.js";
import table from "./table.js";
import highlight from "./highlight.js";

const get = id => document.getElementById(id);

export const exec = (command, value = null) =>
  document.execCommand(command, false, value);

const toggleMenu = (event, targetId) => {
  if (event.target.id !== targetId) {
    return;
  }

  const contains = event.target.classList.contains("active");
  for (const child of toolbar.children) {
    child.classList.remove("active");
  }

  event.target.classList.toggle("active", !contains);
};

const commands = [
  [get("B"), ({ cb }) => { exec("bold"); cb(); }],
  [get("I"), ({ cb }) => { exec("italic"); cb(); }],
  [get("U"), ({ cb }) => { exec("underline"); cb(); }],
  [get("S"), ({ cb }) => { exec("strikeThrough"); cb(); }],

  [get("H"), ({ ev }) => { toggleMenu(ev, "H"); }],
  [get("H1"), ({ cb }) => { exec("formatBlock", "<H1>"); cb(); }],
  [get("H2"), ({ cb }) => { exec("formatBlock", "<H2>"); cb(); }],
  [get("H3"), ({ cb }) => { exec("formatBlock", "<H3>"); cb(); }],

  [get("UL"), ({ cb }) => { exec("insertUnorderedList"); cb(); }],
  [get("OL"), ({ cb }) => { exec("insertOrderedList"); cb(); }],

  [get("CL"), ({ cb }) => { exec("justifyLeft"); cb(); }],
  [get("CC"), ({ cb }) => { exec("justifyCenter"); cb(); }],
  [get("CR"), ({ cb }) => { exec("justifyRight"); cb(); }],

  [get("IMG"), ({ cb }) => {
    insertImageModal((src) => {
      exec("insertImage", src);
      cb();
    });
  }],

  [get("LINK"), ({ cb }) => {
    insertLinkModal((href) => {
      exec("createLink", href);
      cb();
    });
  }],

  [get("PRE"), ({ cb }) => { exec("formatBlock", "<PRE>"); cb(); }],

  [get("TABLE"), ({ ev }) => { toggleMenu(ev, "TABLE"); }],
  [get("TABLE_INSERT"), ({ cb }) => { table.insertTable(cb); }],
  [get("TABLE_ROW_ABOVE"), ({ cb }) => { table.insertRowAbove(cb); }],
  [get("TABLE_ROW_BELOW"), ({ cb }) => { table.insertRowBelow(cb); }],
  [get("TABLE_COLUMN_LEFT"), ({ cb }) => { table.insertColumnLeft(cb); }],
  [get("TABLE_COLUMN_RIGHT"), ({ cb }) => { table.insertColumnRight(cb); }],
  [get("TABLE_HEADING_ROW"), ({ cb }) => { table.toggleHeadingRow(cb); }],
  [get("TABLE_HEADING_COLUMN"), ({ cb }) => { table.toggleHeadingColumn(cb); }],
  [get("TABLE_DELETE_ROW"), ({ cb }) => { table.deleteRow(cb); }],
  [get("TABLE_DELETE_COLUMN"), ({ cb }) => { table.deleteColumn(cb); }],

  [get("HIGH"), ({ cb }) => { highlight(cb); }],

  [get("RF"), ({ cb }) => {
    exec("removeFormat");
    exec("formatBlock", "<DIV>");
    cb();
  }],
];

const tooltips = {
  "B": {
    mac: "Bold (⌘ + B)",
    other: "Bold (Ctrl + B)"
  },
  "I": {
    mac: "Italic (⌘ + I)",
    other: "Italic (Ctrl + I)"
  },
  "U": {
    mac: "Underline (⌘ + U)",
    other: "Underline (Ctrl + U)"
  },
  "S": {
    mac: "Strikethrough (⌘ + Shift + X)",
    other: "Strikethrough (Alt + Shift + 5)"
  },
  "RF": {
    mac: "Remove Format (⌘ + \\)",
    other: "Remove Format (Ctrl + \\)"
  },
  "UL": {
    mac: "Bulleted List (⌘ + Shift + 7)",
    other: "Bulleted List (Ctrl + Shift + 7)"
  },
  "OL": {
    mac: "Numbered List (⌘ + Shift + 8)",
    other: "Numbered List (Ctrl + Shift + 8)"
  }
};

const initialize = (content, tabId) => chrome.runtime.getPlatformInfo((platformInfo) => {
  const os = platformInfo.os === "mac" ? "mac" : "other";
  const cb = () => {
    edit(content, tabId);
  };

  for (const command of commands) {
    const [element, handler] = command;
    element.addEventListener("click", (ev) => {
      handler({ ev, cb });
    });

    const tooltip = tooltips[element.id] && tooltips[element.id][os];
    if (tooltip) {
      element.title = tooltip;
    }
  }
});

export default { initialize };
