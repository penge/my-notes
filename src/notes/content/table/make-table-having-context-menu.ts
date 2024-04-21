export type ContextMenuRenderFunction = (table: HTMLTableElement, event: MouseEvent) => void;

export default (table: HTMLTableElement, renderContextMenu: ContextMenuRenderFunction) => {
  // eslint-disable-next-line no-param-reassign
  table.oncontextmenu = (event) => {
    if (document.body.classList.contains("with-control")) {
      event.preventDefault();
      renderContextMenu(table, event);
    }
  };
};
