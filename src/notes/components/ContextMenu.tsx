import { h } from "preact";
import { useState, useRef, useEffect } from "preact/hooks";
import clsx from "clsx";

export interface ContextMenuProps {
  noteName: string
  x: number
  y: number
  onRename: (noteName: string) => void
  onDelete: (noteName: string) => void
  locked: boolean
  toggleLocked: (noteName: string) => void
}

const ContextMenu = ({
  noteName, x, y, onRename, onDelete, locked, toggleLocked,
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
    <div id="context-menu" ref={ref} style={offsetHeight ? {
      left: x + "px",
      top: (y + offsetHeight < window.innerHeight) ? `${y}px` : "",
      bottom: (y + offsetHeight >= window.innerHeight) ? "1em" : "",
    }: {
      opacity: 0, // offsetHeight NOT set, yet
    }}>
      <div class={clsx("action", locked && "disabled")} onClick={() => !locked && onRename(noteName)}>Rename</div>
      <div class={clsx("action", locked && "disabled")} onClick={() => !locked && onDelete(noteName)}>Delete</div>
      <div class="action" onClick={() => toggleLocked(noteName)}>{locked ? "Unlock" : "Lock"}</div>
    </div>
  );
};

export default ContextMenu;
