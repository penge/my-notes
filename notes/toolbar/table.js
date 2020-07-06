/* global document */

import { withRange } from "../range.js";

const withClosest = (nodeName, fn) => withRange((range) => {
  const el = range.startContainer.nodeName === nodeName
    ? range.startContainer
    : range.startContainer.parentElement.closest(nodeName);

  if (el) {
    fn(el);
  }
});

const withtd = (fn) => withClosest("TD", fn);
const withtr = (fn) => withClosest("TR", fn);

const insertRow = (table, rowIndex, cellCount) => {
  const row = table.insertRow(rowIndex);
  for (let c = 0; c < cellCount; c += 1) {
    row.insertCell(-1);
  }
};

const insertTable = (cb) => withRange((range) => {
  const table = document.createElement("table");
  for (let r = 0; r < 3; r += 1) {
    insertRow(table, -1, 3);
  }

  range.insertNode(table);
  document.getSelection().empty();
  cb();
});

const insertRowRelative = (delta, cb) => withtr((tr) => {
  const table = tr.closest("table");
  const index = tr.rowIndex + delta;
  const cellCount = table.rows[0].cells.length;
  insertRow(table, index, cellCount);
  cb();
});

const insertRowAbove = (cb) => insertRowRelative(0, cb);
const insertRowBelow = (cb) => insertRowRelative(1, cb);

const insertColumnRelative = (delta, cb) => withtd((td) => {
  const table = td.closest("table");
  const index = td.cellIndex + delta;
  for (let row = 0; row < table.rows.length; row += 1) {
    table.rows[row].insertCell(index);
  }
  cb();
});

const insertColumnLeft = (cb) => insertColumnRelative(0, cb);
const insertColumnRight = (cb) => insertColumnRelative(1, cb);

const toggleHeadingRow = (cb) => withtd((td) => {
  const containsHeading = td.classList.contains("heading");

  const tr = td.closest("tr");
  const cellCount = tr.cells.length;
  for (let c = 0; c < cellCount; c += 1) {
    tr.cells[c].classList.toggle("heading", !containsHeading);
  }

  cb();
});

const toggleHeadingColumn = (cb) => withtd((td) => {
  const containsHeading = td.classList.contains("heading");

  const table = td.closest("table");
  const cellIndex = td.cellIndex;
  for (let row = 0; row < table.rows.length; row += 1) {
    table.rows[row].cells[cellIndex].classList.toggle("heading", !containsHeading);
  }

  cb();
});

const deleteRow = (cb) => withtr((tr) => {
  const table = tr.closest("table");
  const rowIndex = tr.rowIndex;
  table.deleteRow(rowIndex);

  // Delete table if having no rows
  if (table.rows.length === 0) {
    table.remove();
  }

  cb();
});

const deleteColumn = (cb) => withtd((td) => {
  const table = td.closest("table");
  const cellIndex = td.cellIndex;
  for (let row = 0; row < table.rows.length; row += 1) {
    table.rows[row].deleteCell(cellIndex);
  }

  // Delete table if having no coluns
  if (table.rows[0].cells.length === 0) {
    table.remove();
  }

  cb();
});

export default {
  insertTable,

  insertRowAbove,
  insertRowBelow,

  insertColumnLeft,
  insertColumnRight,

  toggleHeadingRow,
  toggleHeadingColumn,

  deleteRow,
  deleteColumn,
};
