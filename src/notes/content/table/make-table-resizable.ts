import * as cells from "./cells";

const TABLE_RESIZING_DIV_CLASSNAME = "table-resizing-div";
const TABLE_COLUMN_RESIZING_DIV_CLASSNAME = "table-column-resizing-div";
const TABLE_ROW_RESIZING_DIV_CLASSNAME = "table-row-resizing-div";

type ResizeType = "column" | "row";
export type OnResizeCallback = () => void;

interface MakeTableResizableProps {
  document: Document
  table: HTMLTableElement
  onResize: OnResizeCallback
}

interface CreateResizingDivProps extends MakeTableResizableProps {
  type: ResizeType
  cell: HTMLTableCellElement
  allCells: HTMLTableCellElement[]
}

const isResizingTable = (document: Document) => document.body.classList.contains("resizing-table");

const createResizingDiv = ({
  document,
  table,
  onResize,

  type,
  cell,
  allCells,
}: CreateResizingDivProps) => {
  const resizingDiv = document.createElement("div");
  const specificClassname = type === "column" ? TABLE_COLUMN_RESIZING_DIV_CLASSNAME : TABLE_ROW_RESIZING_DIV_CLASSNAME;
  resizingDiv.classList.add(TABLE_RESIZING_DIV_CLASSNAME, specificClassname);

  const property: cells.ResizeProperty = type === "column" ? "width" : "height";

  const getAnchor = (event: MouseEvent) => (type === "column" ? event.x : event.y);

  resizingDiv.onmousedown = (mousedownEvent: MouseEvent) => {
    resizingDiv.classList.add("active");
    document.body.classList.add("resizing-table", `resizing-table-${type}`);
    table.classList.add("locked");

    let anchor = getAnchor(mousedownEvent);

    const mousemoveListener = (mousemoveEvent: MouseEvent): void => {
      const delta = (anchor - getAnchor(mousemoveEvent)) * -1;
      anchor = getAnchor(mousemoveEvent);

      const currentValue = parseInt(window.getComputedStyle(cell)[property], 10);
      const newValue = currentValue + delta;
      cells.resizeCells(allCells, property, newValue);
    };

    document.addEventListener("mousemove", mousemoveListener);

    const mouseupListener = () => {
      document.body.classList.remove(
        "resizing-table",
        "resizing-table-column",
        "resizing-table-row",
      );
      resizingDiv.classList.remove("active");
      table.classList.remove("locked");
      document.removeEventListener("mousemove", mousemoveListener);
      document.removeEventListener("mouseup", mouseupListener);
      onResize();
    };

    document.addEventListener("mouseup", mouseupListener);
  };

  resizingDiv.ondblclick = () => {
    cells.resetCellsSize(allCells, property);
    onResize();
  };

  return resizingDiv;
};

const removeResizingDivs = (table: HTMLTableElement) => (
  table.querySelectorAll(`.${TABLE_RESIZING_DIV_CLASSNAME}`).forEach((div) => div.remove())
);

export default (props: MakeTableResizableProps): void => {
  const { document, table } = props;
  for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex += 1) {
    for (let cellIndex = 0; cellIndex < table.rows[rowIndex].cells.length; cellIndex += 1) {
      const cell = table.rows[rowIndex].cells[cellIndex];

      cell.onmouseleave = () => {
        if (isResizingTable(document)) {
          return;
        }

        removeResizingDivs(table);
      };

      const allCellsInRow = cells.getCellsInRow(table, rowIndex);
      const allCellsInColumn = cells.getCellsInColumn(table, cellIndex);

      cell.onmouseenter = () => {
        if (isResizingTable(document)) {
          return;
        }

        removeResizingDivs(table);

        cell.appendChild(createResizingDiv({
          ...props,
          type: "row",
          cell,
          allCells: allCellsInRow,
        }));

        cell.appendChild(createResizingDiv({
          ...props,
          type: "column",
          cell,
          allCells: allCellsInColumn,
        }));
      };
    }
  }
};
