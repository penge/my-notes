/* global document */

import { withRange } from "../range.js";
import { getNodes } from "../content.js";
import { createSpan } from "./span.js";

const HIGHLIGHT_CLASS = "my-notes-highlight";

const highlight = (cb) => withRange((range) => {
  const nodes = getNodes(range);
  for (const node of nodes) {
    const value = node.nodeValue;

    // Split value in 3 parts
    const before = value.substring(0, range.startOffset);
    const selected = value.substring(range.startOffset, range.endOffset);
    const after = value.substring(range.endOffset);

    // Stop if no text is selected
    if (!selected) {
      continue;
    }

    // Parent (replace parent if already highlighted)
    const parent = node.parentNode;
    const parentHigh = parent.classList.contains(HIGHLIGHT_CLASS);

    // New nodes (keep before and after highlighted; highlight selected or invert it)
    let newNodes = [];
    if (before) { newNodes.push(parentHigh ? createSpan(before, HIGHLIGHT_CLASS) : before); }
    if (selected) { newNodes.push(parentHigh ? selected : createSpan(selected, HIGHLIGHT_CLASS)); }
    if (after) { newNodes.push(parentHigh ? createSpan(after, HIGHLIGHT_CLASS) : after); }

    (parentHigh ? parent : node).replaceWith(...newNodes);
    document.getSelection().empty();
  }

  cb();
});

export default highlight;
