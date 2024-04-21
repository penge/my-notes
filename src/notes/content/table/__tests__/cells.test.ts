import { prepareDom, tableHtml } from "./fixtures";
import {
  getCellsInRow,
  getCellsInColumn,

  ResizeProperty,
  resizeCells,
  resetCellsSize,
} from "../cells";

const mapFn = (cell: HTMLTableCellElement) => cell.innerHTML;

test("getCellsInRow() returns cells in a row", () => {
  const { table } = prepareDom(tableHtml);

  expect(getCellsInRow(table, 0).map(mapFn)).toEqual(["A", "B", "C"]);
  expect(getCellsInRow(table, 1).map(mapFn)).toEqual(["D", "E", "F"]);
  expect(getCellsInRow(table, 2).map(mapFn)).toEqual(["G", "H", "I"]);

  expect(getCellsInRow(table, -1).map(mapFn)).toEqual([]);
  expect(getCellsInRow(table, 99).map(mapFn)).toEqual([]);
});

test("getCellsInColumn() returns cells in a column", () => {
  const { table } = prepareDom(tableHtml);

  expect(getCellsInColumn(table, 0).map(mapFn)).toEqual(["A", "D", "G"]);
  expect(getCellsInColumn(table, 1).map(mapFn)).toEqual(["B", "E", "H"]);
  expect(getCellsInColumn(table, 2).map(mapFn)).toEqual(["C", "F", "I"]);

  expect(getCellsInColumn(table, -1).map(mapFn)).toEqual([]);
  expect(getCellsInColumn(table, 99).map(mapFn)).toEqual([]);
});

const expectCellsProperty = (cells: HTMLTableCellElement[], property: ResizeProperty, value: string) => (
  cells.forEach((cell) => expect(cell.style.getPropertyValue(property)).toBe(value))
);

test("resizeCells() sets cells width or height", () => {
  const { table } = prepareDom(tableHtml);

  const columnCells = getCellsInColumn(table, 1);
  resizeCells(columnCells, "width", 400);
  expectCellsProperty(columnCells, "width", "400px");

  const rowCells = getCellsInRow(table, 1);
  resizeCells(rowCells, "height", 200);
  expectCellsProperty(rowCells, "height", "200px");
});

describe("resetCellsSize()", () => {
  let columnCells: HTMLTableCellElement[];
  let rowCells: HTMLTableCellElement[];

  beforeEach(() => {
    const { table } = prepareDom(tableHtml);

    columnCells = getCellsInColumn(table, 1);
    resizeCells(columnCells, "width", 400);
    expectCellsProperty(columnCells, "width", "400px");

    rowCells = getCellsInRow(table, 1);
    resizeCells(rowCells, "height", 200);
    expectCellsProperty(rowCells, "height", "200px");
  });

  it("resets width only", () => {
    resetCellsSize(columnCells, "width");
    expectCellsProperty(columnCells, "width", "");

    // height should remain unchanged
    expectCellsProperty(rowCells, "height", "200px");
  });

  it("resets height only", () => {
    resetCellsSize(rowCells, "height");
    expectCellsProperty(rowCells, "height", "");

    // width should remain unchanged
    expectCellsProperty(columnCells, "width", "400px");
  });

  it("resets width and height", () => {
    resetCellsSize(columnCells, "width");
    resetCellsSize(rowCells, "height");

    expectCellsProperty(columnCells, "width", "");
    expectCellsProperty(rowCells, "height", "");
  });
});
