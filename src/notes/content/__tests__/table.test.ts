import { JSDOM } from "jsdom";
import {
  getAllCellsInColumn,
  MakeTableResizableProps,
  makeTableResizable,
  reinitTable,
} from "../table";

// A B C
// D E F
// G H I
const tableHtml = `<table>
  <tbody><tr>
    <td>A</td>
    <td>B</td>
    <td>C</td>
  </tr>
  <tr>
    <td>D</td>
    <td>E</td>
    <td>F</td>
  </tr>
  <tr>
    <td>G</td>
    <td>H</td>
    <td>I</td>
  </tr></tbody>
</table>`;

const tableHtmlHoverE = `<table>
  <tbody><tr>
    <td>A</td>
    <td>B<div class="table-resizing-div table-column-resizing-div"></div></td>
    <td>C</td>
  </tr>
  <tr>
    <td>D<div class="table-resizing-div table-row-resizing-div"></div></td>
    <td>E<div class="table-resizing-div table-column-resizing-div"></div><div class="table-resizing-div table-row-resizing-div"></div></td>
    <td>F<div class="table-resizing-div table-row-resizing-div"></div></td>
  </tr>
  <tr>
    <td>G</td>
    <td>H<div class="table-resizing-div table-column-resizing-div"></div></td>
    <td>I</td>
  </tr></tbody>
</table>`;

const tableHtmlHoverI = `<table>
  <tbody><tr>
    <td>A</td>
    <td>B</td>
    <td>C<div class="table-resizing-div table-column-resizing-div"></div></td>
  </tr>
  <tr>
    <td>D</td>
    <td>E</td>
    <td>F<div class="table-resizing-div table-column-resizing-div"></div></td>
  </tr>
  <tr>
    <td>G<div class="table-resizing-div table-row-resizing-div"></div></td>
    <td>H<div class="table-resizing-div table-row-resizing-div"></div></td>
    <td>I<div class="table-resizing-div table-column-resizing-div"></div><div class="table-resizing-div table-row-resizing-div"></div></td>
  </tr></tbody>
</table>`;

const prepareDom = (tableHtml: string): { dom: JSDOM, table: HTMLTableElement } => {
  const dom = new JSDOM();
  dom.window.document.body.insertAdjacentHTML("afterbegin", tableHtml);
  const table = dom.window.document.body.children[0] as HTMLTableElement;
  return { dom, table };
};

test("getAllCellsInColumn() returns cells in a column", () => {
  const { table } = prepareDom(tableHtml);

  expect(getAllCellsInColumn(table, 0).map((cell) => cell.innerHTML)).toEqual(["A", "D", "G"]);
  expect(getAllCellsInColumn(table, 1).map((cell) => cell.innerHTML)).toEqual(["B", "E", "H"]);
  expect(getAllCellsInColumn(table, 2).map((cell) => cell.innerHTML)).toEqual(["C", "F", "I"]);
  expect(getAllCellsInColumn(table, 99).map((cell) => cell.innerHTML)).toEqual([]);
});

describe("reinitTable", () => {
  let dom: JSDOM;
  let table: HTMLTableElement;
  let resizableProps: MakeTableResizableProps;
  let makeTableResizableFunction: jest.Mock;

  beforeEach(() => {
    const prepared = prepareDom(tableHtmlHoverE);
    dom = prepared.dom;
    table = prepared.table;
    resizableProps = {
      document: dom.window.document,
      computedStyleFunction: dom.window.getComputedStyle,
      table,
      onResize: () => { return; }
    };
    makeTableResizableFunction = jest.fn();
    reinitTable({
      resizableProps,
      makeTableResizableFunction,
    });
  });

  it("removes resizing divs if left over", () => {
    expect(table.outerHTML).toBe(tableHtml);
  });

  it("calls resizable function", () => {
    expect(makeTableResizableFunction).toHaveBeenCalledTimes(1);
    expect(makeTableResizableFunction).toHaveBeenCalledWith(resizableProps);
  });
});

describe("makeTableResizable()", () => {
  let dom: JSDOM;
  let table: HTMLTableElement;
  let onResize: jest.Mock;

  beforeEach(() => {
    const prepared = prepareDom(tableHtml);
    dom = prepared.dom;
    table = prepared.table;
    onResize = jest.fn(),

    makeTableResizable({
      document: dom.window.document,
      computedStyleFunction: dom.window.getComputedStyle,
      table,
      onResize,
    });
  });

  it("keeps table markup unchanged", () => {
    expect(table.outerHTML).toBe(tableHtml);
  });

  it("does NOT call onResize on init", () => {
    expect(onResize).not.toHaveBeenCalled();
  });

  it("adds resizing divs on mouseenter, removes them on mouseleave", () => {
    const enterAndLeave = (cell: HTMLTableCellElement, expectedTableHtmlOnEnter: string) => {
      cell.dispatchEvent(new dom.window.Event("mouseenter"));
      expect(table.outerHTML).toBe(expectedTableHtmlOnEnter);

      cell.dispatchEvent(new dom.window.Event("mouseleave"));
      expect(table.outerHTML).toBe(tableHtml);
    };

    enterAndLeave(table.rows[1].cells[1], tableHtmlHoverE); // enter and leave E
    enterAndLeave(table.rows[2].cells[2], tableHtmlHoverI); // enter and leave I
  });
});
