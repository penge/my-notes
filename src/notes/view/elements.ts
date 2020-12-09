import { getElementById as _get } from "dom/index";

const googleFonts = _get("google-fonts") as HTMLLinkElement;

// Note
const content = _get("content");
const toolbar = _get("toolbar");

// Sidebar
const sidebar = _get("sidebar");
const sidebarNotes = _get("sidebar-notes");
const drag = _get("drag");
const newNote = _get("new-note");
const openOptions = _get("open-options");
const syncNow = _get("sync-now");
const contextMenu = _get("context-menu");
const useAsClipboardAction = _get("use-as-clipboard");
const renameAction = _get("rename");
const deleteAction = _get("delete");

// Templates
const newVersionNotificationTemplate = _get("new-version-notification-template") as HTMLTemplateElement;
const modalTemplate = _get("modal-template") as HTMLTemplateElement;

export {
  googleFonts,

  // Note
  content,
  toolbar,

  // Sidebar
  sidebar,
  sidebarNotes,
  drag,
  newNote,
  openOptions,
  syncNow,
  contextMenu,
  useAsClipboardAction,
  renameAction,
  deleteAction,

  // Templates
  newVersionNotificationTemplate,
  modalTemplate,
};
