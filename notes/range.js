/* global document */

let selection;
let range;

const save = () => {
  selection = document.getSelection();
  if (selection.rangeCount > 0) {
    range = selection.getRangeAt(0);
  }
};

const restore = () => {
  if (range) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export default {
  save,
  restore,
};
