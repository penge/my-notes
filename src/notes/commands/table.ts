import __range, { withRange } from "../range";

type Callback = () => void;

const withClosest = <T>(nodeName: string, fn: (el: T) => void) => withRange((range: Range) => {
  const el = range.startContainer.nodeName === nodeName
    ? range.startContainer as unknown
    : range.startContainer?.parentElement?.closest(nodeName) as unknown;

  if (el) {
    fn(el as T);
  }
});

const withtd = (fn: (tr: HTMLTableCellElement) => void) => withClosest<HTMLTableCellElement>("TD", fn);
const withtr = (fn: (tr: HTMLTableRowElement) => void) => withClosest<HTMLTableRowElement>("TR", fn);

const insertRow = (table: HTMLTableElement, rowIndex: number, cellCount: number) => {
  const row = table.insertRow(rowIndex);
  for (let c = 0; c < cellCount; c += 1) {
    const newCell = row.insertCell(-1); // insert empty cell at the end of the row

    // put BR into the empty cell so it has default font's height (by default it could have tiny height)
    newCell.appendChild(document.createElement("BR"));
  }
};

const insertTable = (cb: Callback): void => withRange((range: Range) => {
  const table = document.createElement("table");
  for (let r = 0; r < 3; r += 1) {
    insertRow(table, -1, 3);
  }

  range.insertNode(table);
  __range.empty();
  cb();
});

const insertRowRelative = (delta: number, cb: Callback) => withtr((tr: HTMLTableRowElement) => {
  const table = tr.closest("table") as HTMLTableElement;
  const index = tr.rowIndex + delta;
  const cellCount = table.rows[0].cells.length;
  insertRow(table, index, cellCount);
  __range.restore();
  cb();
});

const insertRowAbove = (cb: Callback): void => insertRowRelative(0, cb);
const insertRowBelow = (cb: Callback): void => insertRowRelative(1, cb);

const insertColumnRelative = (delta: number, cb: Callback) => withtd((td: HTMLTableCellElement) => {
  const table = td.closest("table") as HTMLTableElement;
  const index = td.cellIndex + delta;
  for (let row = 0; row < table.rows.length; row += 1) {
    table.rows[row].insertCell(index);
  }
  __range.restore();
  cb();
});

const insertColumnLeft = (cb: Callback): void => insertColumnRelative(0, cb);
const insertColumnRight = (cb: Callback): void => insertColumnRelative(1, cb);

const toggleHeadingRow = (cb: Callback): void => withtd((td: HTMLTableCellElement) => {
  const containsHeading = td.classList.contains("heading");

  const tr = td.closest("tr") as HTMLTableRowElement;
  const cellCount = tr.cells.length;
  for (let c = 0; c < cellCount; c += 1) {
    tr.cells[c].classList.toggle("heading", !containsHeading);
  }

  __range.restore();
  cb();
});

const toggleHeadingColumn = (cb: Callback): void => withtd((td: HTMLTableCellElement) => {
  const containsHeading = td.classList.contains("heading");

  const table = td.closest("table") as HTMLTableElement;
  const { cellIndex } = td;
  for (let row = 0; row < table.rows.length; row += 1) {
    table.rows[row].cells[cellIndex].classList.toggle("heading", !containsHeading);
  }

  __range.restore();
  cb();
});

const deleteRow = (cb: Callback): void => withtr((tr: HTMLTableRowElement) => {
  const table = tr.closest("table") as HTMLTableElement;
  const { rowIndex } = tr;
  table.deleteRow(rowIndex);

  // Delete table if having no rows
  if (table.rows.length === 0) {
    table.remove();
  }

  __range.empty();
  cb();
});

const deleteColumn = (cb: Callback): void => withtd((td: HTMLTableCellElement) => {
  const table = td.closest("table") as HTMLTableElement;
  const { cellIndex } = td;
  for (let row = 0; row < table.rows.length; row += 1) {
    table.rows[row].deleteCell(cellIndex);
  }

  // Delete table if having no coluns
  if (table.rows[0].cells.length === 0) {
    table.remove();
  }

  __range.empty();
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
