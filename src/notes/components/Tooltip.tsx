import { h, render, cloneElement, Fragment } from "preact";
import { useRef, useState, useEffect, useMemo, useCallback } from "preact/hooks";

interface TooltipProps {
  id?: string
  tooltip: string | h.JSX.Element
  children: h.JSX.Element
  className?: string
}

interface TooltipRenderProps {
  id?: string
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

const MINIMAL_OFFSET = 5;
const EDGE_OFFSET = ".5em";

const getTooltipPosition = (childrenRect: DOMRect, rect: DOMRect): h.JSX.CSSProperties => {
  const styles: h.JSX.CSSProperties = {
    top: `calc(${childrenRect.top - rect.height}px - 1.5em)`,
  };

  const leftOffset = (childrenRect.left + (childrenRect.width / 2) - (rect.width / 2));

  if (leftOffset < MINIMAL_OFFSET) { // handle LEFT edge (5px gap at least)
    styles.left = EDGE_OFFSET;

  } else if ((leftOffset + rect.width + MINIMAL_OFFSET) > window.innerWidth) { // handle RIGHT edge (5px gap at least)
    styles.right = EDGE_OFFSET;

  } else {
    styles.left = leftOffset;
  }

  return styles;
};

const TooltipRender = ({ tooltip, childrenRect, className }: TooltipRenderProps) => {
  if (!tooltip) {
    return null;
  }

  const ref = useRef<HTMLDivElement>(null);
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

let renderProps: TooltipRenderProps | undefined;

const Tooltip = ({ id, tooltip, children, className }: TooltipProps): h.JSX.Element => {
  const show = useCallback((props: TooltipRenderProps) => render(<TooltipRender {...props} />, getContainer()), []);
  const hide = useCallback(() => render("", getContainer()), []);

  useEffect(() => {
    if (!renderProps || (!id || (id && renderProps.id !== id))) {
      return;
    }

    show({
      ...renderProps,
      tooltip,
    });
  }, [tooltip]);

  const clone = cloneElement(children, {
    onMouseOver: (event) => {
      if (event.currentTarget !== event.target) {
        return;
      }
      const childrenRect = event.currentTarget.getBoundingClientRect();
      renderProps = { id, tooltip, childrenRect, className };
      show(renderProps);
    },
    onMouseLeave: () => {
      renderProps = undefined;
      hide();
    },
  } as h.JSX.HTMLAttributes<HTMLDivElement>);

  return clone;
};

export default Tooltip;
