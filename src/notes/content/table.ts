/* eslint-disable no-param-reassign */
const TABLE_RESIZING_DIV_CLASSNAME = "table-resizing-div";
const TABLE_COLUMN_RESIZING_DIV_CLASSNAME = "table-column-resizing-div";
const TABLE_ROW_RESIZING_DIV_CLASSNAME = "table-row-resizing-div";

type ResizingType = "column" | "row";
type ComputedStyleFunction = (elt: Element) => CSSStyleDeclaration;
type OnResizeCallback = () => void;

export const getAllCellsInColumn = (table: HTMLTableElement, referenceCellIndex: number): HTMLTableCellElement[] => {
  const cells: HTMLTableCellElement[] = [];

  for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex += 1) {
    for (let cellIndex = 0; cellIndex < table.rows[rowIndex].cells.length; cellIndex += 1) {
      if (cellIndex === referenceCellIndex) {
        cells.push(table.rows[rowIndex].cells[cellIndex]);
      }
    }
  }

  return cells;
};

const isResizingTable = (document: Document) => document.body.classList.contains("resizing-table");

interface CreateResizingDivProps {
  document: Document
  computedStyleFunction: ComputedStyleFunction
  type: ResizingType
  table: HTMLTableElement
  cell: HTMLTableCellElement
  allCells: HTMLTableCellElement[]
  onResize: OnResizeCallback
}

const createResizingDiv = ({
  document,
  computedStyleFunction,
  type,
  table,
  cell,
  allCells,
  onResize,
}: CreateResizingDivProps) => {
  const resizingDiv = document.createElement("div");
  const specificClassname = type === "column" ? TABLE_COLUMN_RESIZING_DIV_CLASSNAME : TABLE_ROW_RESIZING_DIV_CLASSNAME;
  resizingDiv.classList.add(TABLE_RESIZING_DIV_CLASSNAME, specificClassname);

  const isLast = allCells[allCells.length - 1] === cell;
  if (!isLast) {
    if (type === "column") {
      resizingDiv.style.bottom = `-${computedStyleFunction(cell).borderBottomWidth}`;
    }

    if (type === "row") {
      resizingDiv.style.right = `-${computedStyleFunction(cell).borderRightWidth}`;
    }
  }

  const property = type === "column" ? "width" : "height";

  const toggleActiveCells = (toggle: boolean) =>
    allCells.forEach((oneCell) =>
      oneCell.querySelector(`.${TABLE_RESIZING_DIV_CLASSNAME}.${specificClassname}`)?.classList.toggle("active", toggle));

  const resizeAllCells = (value: number) => allCells.forEach((oneCell) => {
    oneCell.style[property] = `${value}px`;
    oneCell.style.wordBreak = "break-all";
  });

  const resetSizeAllCells = () => allCells.forEach((oneCell) => {
    oneCell.style[property] = "";
    oneCell.style.wordBreak = "";
  });

  resizingDiv.addEventListener("mouseenter", () => {
    if (isResizingTable(document) || cell.querySelector(`.${TABLE_RESIZING_DIV_CLASSNAME}.active`)) {
      return;
    }
    toggleActiveCells(true);
  });

  const getAchor = (event: MouseEvent) => (type === "column" ? event.x : event.y);

  resizingDiv.addEventListener("mousedown", (mousedownEvent) => {
    document.body.classList.add("resizing-table", `resizing-table-${type}`);
    table.classList.add("locked");

    let anchor = getAchor(mousedownEvent);

    const mousemoveListener = (mousemoveEvent: MouseEvent): void => {
      const delta = (anchor - getAchor(mousemoveEvent)) * -1;
      anchor = getAchor(mousemoveEvent);

      const currentValue = parseInt(computedStyleFunction(cell)[property], 10);
      const newValue = currentValue + delta;
      resizeAllCells(newValue);
    };

    document.addEventListener("mousemove", mousemoveListener);

    const mouseupListener = () => {
      if (isResizingTable(document)) {
        toggleActiveCells(false);
      }
      document.body.classList.remove("resizing-table", "resizing-table-column", "resizing-table-row");
      table.classList.remove("locked");
      document.removeEventListener("mousemove", mousemoveListener);
      document.removeEventListener("mouseup", mouseupListener);
      onResize();
    };

    document.addEventListener("mouseup", mouseupListener);
  });

  resizingDiv.addEventListener("dblclick", () => {
    resetSizeAllCells();
    onResize();
  });

  resizingDiv.addEventListener("mouseleave", () => {
    if (isResizingTable(document)) {
      return;
    }

    toggleActiveCells(false);
  });

  return resizingDiv;
};

export interface MakeTableResizableProps {
  document: Document
  computedStyleFunction: ComputedStyleFunction
  table: HTMLTableElement
  onResize: OnResizeCallback
}

export const makeTableResizable = ({
  document,
  computedStyleFunction,
  table,
  onResize,
}: MakeTableResizableProps): void => {
  for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex += 1) {
    for (let cellIndex = 0; cellIndex < table.rows[rowIndex].cells.length; cellIndex += 1) {
      const cell = table.rows[rowIndex].cells[cellIndex];

      const allCellsInColumn = getAllCellsInColumn(table, cellIndex);
      const allCellsInRow = [...table.rows[rowIndex].cells];

      cell.onmouseleave = () => {
        if (isResizingTable(document)) {
          return;
        }
        [
          ...allCellsInColumn,
          ...allCellsInRow,
        ].forEach((oneCell) => oneCell.querySelectorAll(`.${TABLE_RESIZING_DIV_CLASSNAME}`).forEach((div) => div.remove()));
      };

      cell.onmouseenter = () => {
        if (isResizingTable(document) || cell.querySelector(`.${TABLE_RESIZING_DIV_CLASSNAME}`)) {
          return;
        }

        allCellsInColumn.forEach((oneCell) => oneCell.appendChild(createResizingDiv({
          document,
          computedStyleFunction,
          type: "column",
          table,
          cell: oneCell,
          allCells: allCellsInColumn,
          onResize,
        })));

        allCellsInRow.forEach((oneCell) => oneCell.appendChild(createResizingDiv({
          document,
          computedStyleFunction,
          type: "row",
          table,
          cell: oneCell,
          allCells: allCellsInRow,
          onResize,
        })));
      };
    }
  }
};

interface ReinitTableProps {
  resizableProps: MakeTableResizableProps
  makeTableResizableFunction: (props: MakeTableResizableProps) => void
}

export const reinitTable = ({ resizableProps, makeTableResizableFunction }: ReinitTableProps): void => {
  const cells = resizableProps.table.querySelectorAll("td");
  cells.forEach((oneCell) => {
    oneCell.onmouseleave = null;
    oneCell.onmouseenter = null;
    oneCell.querySelectorAll(`.${TABLE_RESIZING_DIV_CLASSNAME}`).forEach((div) => div.remove());
  });

  makeTableResizableFunction(resizableProps);
};

interface ReinitTablesProps {
  onResize: OnResizeCallback
}

export const reinitTables = ({ onResize }: ReinitTablesProps): void => {
  const tables = document.querySelectorAll<HTMLTableElement>("body > #content-container > #content table");
  tables.forEach((table) => reinitTable({
    resizableProps: {
      document,
      computedStyleFunction: window.getComputedStyle,
      table,
      onResize,
    },
    makeTableResizableFunction: makeTableResizable,
  }));
};
