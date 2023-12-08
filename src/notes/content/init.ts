import { initTables } from "./table";
import renderTableContextMenu from "./render-table-context-menu";

export default () => {
  initTables({
    contextMenuRenderFunction: renderTableContextMenu,
  });
};
