import { h } from "preact";
import { useState, useRef, useEffect } from "preact/hooks";
import clsx from "clsx";
import { t } from "i18n";

export interface ContextMenuProps {
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

const ContextMenu = ({
  x, y,
  onRename, onDelete, onToggleLocked, onTogglePinnedTime, onDuplicate, onExport,
  locked, pinned,
}: ContextMenuProps): h.JSX.Element => {
  const [offsetHeight, setOffsetHeight] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (offsetHeight) {
      return; // offsetHeight already set
    }

    setOffsetHeight(ref.current.offsetHeight);
  }, [ref.current, offsetHeight]);

  return (
    <div
      id="context-menu"
      ref={ref}
      style={offsetHeight ? {
        left: `${x}px`,
        top: (y + offsetHeight < window.innerHeight) ? `${y}px` : "",
        bottom: (y + offsetHeight >= window.innerHeight) ? "1em" : "",
      } : {
        opacity: 0, // offsetHeight NOT set, yet
      }}
    >
      <div className={clsx("action", locked && "disabled")} onClick={() => !locked && onRename()}>{t("Rename")}</div>
      <div className={clsx("action", locked && "disabled")} onClick={() => !locked && onDelete()}>{t("Delete")}</div>
      <div className="action" onClick={() => onToggleLocked()}>{locked ? t("Unlock") : t("Lock")}</div>
      <div className="action" onClick={() => onTogglePinnedTime()}>{pinned ? t("Unpin") : t("Pin")}</div>
      <div className="action" onClick={() => onDuplicate()}>{t("Duplicate")}</div>
      <div className="action" onClick={() => onExport()}>{t("Export")}</div>
    </div>
  );
};

export default ContextMenu;
