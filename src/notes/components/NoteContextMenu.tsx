import { h } from "preact";
import clsx from "clsx";
import { t } from "i18n";
import ContextMenu from "./ContextMenu";

export interface NoteContextMenuProps {
  x: number
  y: number
  onRename: () => void
  onDelete: () => void
  onToggleLocked: () => void
  onTogglePinnedTime: () => void
  onDuplicate: () => void
  onExport: () => void
  locked: boolean
  pinned: boolean
}

const NoteContextMenu = ({
  x, y,
  onRename, onDelete, onToggleLocked, onTogglePinnedTime, onDuplicate, onExport,
  locked, pinned,
}: NoteContextMenuProps): h.JSX.Element => (
  <ContextMenu x={x} y={y}>
    <div className={clsx("action", locked && "disabled")} onClick={() => !locked && onRename()}>{t("Rename")}</div>
    <div className={clsx("action", locked && "disabled")} onClick={() => !locked && onDelete()}>{t("Delete")}</div>
    <div className="action" onClick={() => onToggleLocked()}>{locked ? t("Unlock") : t("Lock")}</div>
    <div className="action" onClick={() => onTogglePinnedTime()}>{pinned ? t("Unpin") : t("Pin")}</div>
    <div className="action" onClick={() => onDuplicate()}>{t("Duplicate")}</div>
    <div className="action" onClick={() => onExport()}>{t("Export")}</div>
  </ContextMenu>
);

export default NoteContextMenu;
