import { h, render, cloneElement, Fragment } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { useRef, useState, useEffect, useMemo } from "preact/hooks";

interface TooltipProps {
  tooltip: string | h.JSX.Element
  children: h.JSX.Element
  className?: string
}

interface TooltipRenderProps {
  tooltip: string | h.JSX.Element
  childrenRect: DOMRect
  className?: string
}

const getContainer = () => {
  const container = document.getElementById("tooltip-container");
  if (!container) {
    throw new Error("Container not found!");
  }
  return container;
};

const getTooltipPosition = (childrenRect: DOMRect, rect: DOMRect): h.JSX.CSSProperties => {
  const styles: h.JSX.CSSProperties = {
    top: `calc(${childrenRect.top - rect.height}px - 1.5em)`,
  };

  const leftOffset = (childrenRect.left + (childrenRect.width / 2) - (rect.width / 2));

  if (leftOffset < 0) { // handle LEFT edge
    styles.left = "1em";

  } else if ((leftOffset + rect.width) > window.innerWidth) { // handle RIGHT edge
    styles.right = "1em";

  } else {
    styles.left = leftOffset;
  }

  return styles;
};

const TooltipRender = ({ tooltip, childrenRect, className }: TooltipRenderProps) => {
  if (!tooltip) {
    return null;
  }

  const ref = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState<DOMRect | undefined>(undefined);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setRect(rect);
    }
  }, [ref]);

  const position: h.JSX.CSSProperties | undefined = useMemo(() => {
    return rect && getTooltipPosition(childrenRect, rect);
  }, [rect, childrenRect]);

  // Render hidden tooltip first, to get the width and height,
  // and then use effect to render visible tooltip, where
  // width and height will be used to set the position.
  return (
    <Fragment>
      {!rect && (
        <div
          ref={ref}
          id="tooltip"
          className={className}
          style={{
            left: 0,
            top: 0,
            opacity: 0,
          }}
        >{tooltip}</div>
      )}

      {rect && position && (
        <div
          id="tooltip"
          className={className}
          style={position}
        >{tooltip}</div>
      )}
    </Fragment>
  );
};

const Tooltip = ({ tooltip, children, className }: TooltipProps): h.JSX.Element => {
  const show = (props: TooltipRenderProps) => render(<TooltipRender {...props} />, getContainer());
  const hide = () => render("", getContainer());

  const clone = cloneElement(children, {
    onMouseOver: (event) => {
      if (event.currentTarget !== event.target) {
        return;
      }
      const childrenRect = event.currentTarget.getBoundingClientRect();
      show({ tooltip, childrenRect, className });
    },
    onMouseLeave: () => hide(),
  } as h.JSX.HTMLAttributes<HTMLDivElement>);

  return clone;
};

export default Tooltip;
