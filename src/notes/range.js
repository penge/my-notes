/* global document */

let selection;
let range;

const save = () => {
  selection = document.getSelection();
  if (selection && selection.rangeCount > 0) {
    range = selection.getRangeAt(0);
  } else {
    range = undefined; // reset previous range
  }

  return range;
};

const restore = () => {
  if (range) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export const withRange = (fn) => {
  const range = save();
  if (!range) {
    return;
  }

  fn(range);
};

export default {
  save,
  restore,
};
