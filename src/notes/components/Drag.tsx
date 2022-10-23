/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-param-reassign */
import { h, RefObject } from "preact";
import { useCallback } from "preact/hooks";

let mousePosition: number;

function resize(e: MouseEvent, sidebar: RefObject<HTMLDivElement>) {
  if (!sidebar.current) {
    return;
  }

  const dx = (mousePosition - e.x) * -1;
  mousePosition = e.x;

  const width = window.innerWidth;
  const max = width / 2; // 50%
  if (mousePosition >= max) {
    document.body.classList.add("resizing-sidebar-locked-max");
    return;
  }

  const min = ((width / 100) * 0.3); // .3%
  if (mousePosition <= min) {
    document.body.classList.add("resizing-sidebar-locked-min");
    return;
  }

  document.body.classList.remove("resizing-sidebar-locked-min", "resizing-sidebar-locked-max");

  const sidebarWidth = parseInt(window.getComputedStyle(sidebar.current).width, 10) + dx;
  sidebar.current.style.width = `${sidebarWidth}px`;
  document.body.style.left = `${sidebarWidth}px`;
}

interface DragProps {
  sidebar: RefObject<HTMLDivElement>
}

const Drag = ({ sidebar }: DragProps): h.JSX.Element => {
  const mousemoveListener = useCallback((e: MouseEvent) => resize(e, sidebar), [sidebar]);
  const mouseupListener = useCallback(() => {
    if (!document.body.classList.contains("resizing-sidebar")) {
      return;
    }

    // Remove listeners and classes
    document.removeEventListener("mousemove", mousemoveListener);
    document.removeEventListener("mouseup", mouseupListener);
    document.body.classList.remove("resizing-sidebar", "resizing-sidebar-locked-min", "resizing-sidebar-locked-max");

    if (!sidebar.current) {
      return;
    }

    // Apply new sidebar width
    const sidebarWidth = sidebar.current.style.width;
    sidebar.current.style.minWidth = sidebarWidth;
    chrome.storage.local.set({ sidebarWidth });
  }, [sidebar]);

  return (
    <div
      id="drag"
      onMouseDown={(e) => {
        if (!sidebar.current) {
          return;
        }

        mousePosition = e.x;
        document.body.classList.add("resizing-sidebar");
        sidebar.current.style.minWidth = "";

        // Add listeners
        document.addEventListener("mousemove", mousemoveListener);
        document.addEventListener("mouseup", mouseupListener);
      }}
      // eslint-disable-next-line react/no-unknown-property
      onDblClick={() => {
        if (!sidebar.current) {
          return;
        }

        chrome.storage.local.remove("sidebarWidth");

        // Reset sidebar width
        sidebar.current.style.width = "";
        sidebar.current.style.minWidth = "";
        document.body.style.left = "";
      }}
    />
  );
};

export default Drag;
