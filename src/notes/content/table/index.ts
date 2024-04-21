import makeTableHavingContextMenu, { ContextMenuRenderFunction } from "./make-table-having-context-menu";
import makeTableResizable, { OnResizeCallback } from "./make-table-resizable";

interface InitTables {
  onResize: OnResizeCallback
  contextMenuRenderFunction: ContextMenuRenderFunction
}

// eslint-disable-next-line import/prefer-default-export
export const initTables = ({
  onResize,
  contextMenuRenderFunction,
}: InitTables): void => {
  const tables = document.querySelectorAll<HTMLTableElement>("body > #content-container > #content table");
  tables.forEach((table) => {
    makeTableHavingContextMenu(table, contextMenuRenderFunction);

    makeTableResizable({
      document,
      table,
      onResize,
    });
  });
};
