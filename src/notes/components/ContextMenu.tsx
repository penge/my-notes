import { h, ComponentChildren } from "preact";
import { useState, useRef, useEffect } from "preact/hooks";

export interface ContextMenuProps {
  x: number
  y: number
  children: ComponentChildren
}

interface Offsets {
  offsetHeight: number
  offsetWidth: number
}

const ContextMenu = ({ x, y, children }: ContextMenuProps): h.JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState<Offsets | undefined>(undefined);

  useEffect(() => {
    if (!ref.current || offsets) {
      return;
    }

    setOffsets({
      offsetHeight: ref.current.offsetHeight,
      offsetWidth: ref.current.offsetWidth,
    });
  }, [ref.current]);

  return (
    <div
      id="context-menu"
      ref={ref}
      style={offsets ? {
        left: (x + offsets.offsetWidth < window.innerWidth) ? `${x}px` : undefined,
        right: (x + offsets.offsetWidth >= window.innerWidth) ? "1em" : undefined,
        top: (y + offsets.offsetHeight < window.innerHeight) ? `${y}px` : undefined,
        bottom: (y + offsets.offsetHeight >= window.innerHeight) ? "1em" : undefined,
      } : {
        opacity: 0, // offsets NOT known, yet
      }}
    >
      {children}
    </div>
  );
};

export default ContextMenu;
