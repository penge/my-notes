import { h, render } from "preact";
import TableContextMenu from "notes/components/TableContextMenu";
import { dispatchNoteEdited } from "notes/events";

const alignTable = (table: HTMLTableElement, alignment: "left" | "center" | "right") => {
  table.classList.remove(
    "my-notes-table-align-center",
    "my-notes-table-align-right",
  );

  if (alignment === "center" || alignment === "right") {
    table.classList.add(`my-notes-table-align-${alignment}`);
  }

  dispatchNoteEdited();
};

export default (table: HTMLTableElement, event: MouseEvent) => render(
  <TableContextMenu
    x={event.pageX}
    y={event.pageY}
    onAlignLeft={() => alignTable(table, "left")}
    onAlignCenter={() => alignTable(table, "center")}
    onAlignRight={() => alignTable(table, "right")}
  />,
  document.getElementById("context-menu-container")!,
);
