import __range, { withRange } from "../range";

type Callback = () => void

export const HIGHLIGHT_COLORS: string[] = [
  "orange",
  "red",
  "green",
  "blue",
  "yellow",
  "cyan",
  "magenta",
  "purple",
  "black",
  "white",
  "silver",
];

const validCssClasses: string[] = [
  "my-notes-highlight",
  ...HIGHLIGHT_COLORS.map((color) => `my-notes-text-color-${color}`),
];

const highlight = (cssClass: string, cb: Callback): void => withRange((range: Range) => {
  if (
    !validCssClasses.includes(cssClass) ||
    range.startContainer !== range.endContainer ||
    range.startContainer.nodeType !== Node.TEXT_NODE
  ) {
    return;
  }

  const parent = range.startContainer.parentElement;
  const isParentHighlighted = parent && parent.tagName === "SPAN" &&
    validCssClasses.some((clazz) => parent.classList.contains(clazz));

  const newElement = document.createElement("span");
  newElement.classList.add(cssClass);

  if (!parent || !isParentHighlighted) {
    // Surround text with a new highlight <span>
    range.surroundContents(newElement);
  } else {
    const shouldResetClass =
      cssClass === "my-notes-text-color-black" ||
      parent.classList.contains(cssClass);

    if (shouldResetClass) {
      // Replace parent highlight <span> with text (removes highlight style)
      const superParent = parent.parentNode;
      parent.replaceWith(parent.innerText);
      superParent?.normalize(); // join consecutive TEXT_NODEs into one TEXT_NODE (this is a needed cleanup as highlight requires startContainer and endContainer to be the same TEXT_NODE)

    } else {
      // Replace parent highlight <span> with new highlight <span> (changes highlight style)
      newElement.innerText = parent.innerText;
      parent.replaceWith(newElement);
    }
  }

  __range.empty(); // Deselect the text

  cb(); // Save the note
});

export default highlight;
