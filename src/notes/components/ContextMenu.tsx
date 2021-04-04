import { h } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { useState, useRef, useEffect } from "preact/hooks";

export interface ContextMenuProps {
  noteName: string
  x: number
  y: number
  onRename: (noteName: string) => void
  onDelete: (noteName: string) => void
}

const ContextMenu = ({
  noteName, x, y, onRename, onDelete,
}: ContextMenuProps): h.JSX.Element => {
  const [offsetHeight, setOffsetHeight] = useState<number>(0);
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (offsetHeight) {
      return; // offsetHeight already set
    }
    setOffsetHeight(ref.current.offsetHeight);
  }, [ref.current]);

  return (
    <div id="context-menu" ref={ref} style={offsetHeight ? {
      left: x + "px",
      top: (y + offsetHeight < window.innerHeight) ? `${y}px` : "",
      bottom: (y + offsetHeight >= window.innerHeight) ? "1em" : "",
    }: {
      opacity: 0, // offsetHeight NOT set, yet
    }}>
      <div class="action" onClick={() => onRename(noteName)}>Rename</div>
      <div class="action" onClick={() => onDelete(noteName)}>Delete</div>
    </div>
  );
};

export default ContextMenu;
