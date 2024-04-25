import { dispatchNoteEdited } from "notes/events";

import { initImgs } from "./img";
import { initTables } from "./table";
import renderTableContextMenu from "./table/render/render-table-context-menu";

export default () => {
  initImgs();
  initTables({
    onResize: dispatchNoteEdited,
    contextMenuRenderFunction: renderTableContextMenu,
  });
};
