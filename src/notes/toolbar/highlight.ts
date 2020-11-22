import { withRange } from "../range";
import { getNodes } from "../content";
import { createSpan } from "./span";
import { ToolbarCallback } from "./index";

const HIGHLIGHT_CLASS = "my-notes-highlight";

const highlight = (cb: ToolbarCallback): void => withRange((range: Range) => {
  const nodes = getNodes(range);
  for (const node of nodes) {
    const value = node.nodeValue;

    if (!value) {
      return;
    }

    // Split value in 3 parts
    const before = value.substring(0, range.startOffset);
    const selected = value.substring(range.startOffset, range.endOffset);
    const after = value.substring(range.endOffset);

    // Stop if no text is selected
    if (!selected) {
      continue;
    }

    // Parent (replace parent if already highlighted)
    const parent = node.parentNode as HTMLElement;
    if (!parent) {
      return;
    }
    const parentHigh = parent.classList.contains(HIGHLIGHT_CLASS);

    // New nodes (keep before and after highlighted; highlight selected or invert it)
    const newNodes: (string | HTMLSpanElement)[] = [];
    if (before) { newNodes.push(parentHigh ? createSpan(before, HIGHLIGHT_CLASS) : before); }
    if (selected) { newNodes.push(parentHigh ? selected : createSpan(selected, HIGHLIGHT_CLASS)); }
    if (after) { newNodes.push(parentHigh ? createSpan(after, HIGHLIGHT_CLASS) : after); }

    (parentHigh ? parent : node as HTMLElement).replaceWith(...newNodes);
    const selection = document.getSelection();
    selection?.empty();
  }

  cb();
});

export default highlight;
