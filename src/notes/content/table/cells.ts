/* eslint-disable no-param-reassign */

export const getCellsInRow = (table: HTMLTableElement, row: number): HTMLTableCellElement[] => {
  const theRow = table.rows[row] as HTMLTableRowElement | undefined;
  return theRow ? [...theRow.cells] : [];
};

export const getCellsInColumn = (table: HTMLTableElement, column: number): HTMLTableCellElement[] => {
  const cells: HTMLTableCellElement[] = [];

  for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex += 1) {
    for (let cellIndex = 0; cellIndex < table.rows[rowIndex].cells.length; cellIndex += 1) {
      if (cellIndex === column) {
        cells.push(table.rows[rowIndex].cells[cellIndex]);
      }
    }
  }

  return cells;
};

export type ResizeProperty = "width" | "height";

const setCellsProperty = (cells: HTMLTableCellElement[], property: ResizeProperty, value: string) => {
  cells.forEach((cell) => {
    cell.style[property] = value;
  });
};

export const resizeCells = (cells: HTMLTableCellElement[], property: ResizeProperty, value: number) => {
  setCellsProperty(cells, property, `${value}px`);
};

export const resetCellsSize = (cells: HTMLTableCellElement[], property: ResizeProperty) => {
  setCellsProperty(cells, property, "");
};
