import { initImgs } from "./img";
import { initTables } from "./table";
import renderTableContextMenu from "./render-table-context-menu";

export default () => {
  initImgs();
  initTables({
    contextMenuRenderFunction: renderTableContextMenu,
  });
};
