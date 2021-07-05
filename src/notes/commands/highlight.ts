import __range, { withRange } from "../range";

type Callback = () => void;

export const HIGHLIGHT_COLORS: string[] = [
  "orange",
  "red",
  "green",
  "blue",
  "yellow",
  "cyan",
  "magenta",
  "purple",
  "silver",
];

const validCssClasses: string[] = [
  "my-notes-highlight",
  ...HIGHLIGHT_COLORS.map((color) => `my-notes-text-color-${color}`),
  "my-notes-text-color-auto", // used to change text color to theme's default
];

const createSpan = (cssClass: string, innerText?: string) => {
  const span = document.createElement("span");
  span.classList.add(cssClass);
  if (innerText) {
    span.innerText = innerText;
  }
  return span;
};

const highlight = (cssClass: string, cb: Callback): void => withRange((range: Range) => {
  if (
    !validCssClasses.includes(cssClass) ||           // only valid CSS class can be added
    range.startContainer !== range.endContainer ||   // selection must be within the same element (in other words, selection across different elements is not allowed)
    range.startContainer.nodeType !== Node.TEXT_NODE // CSS can be applied only if text is selected
  ) {
    return;
  }

  const parent = range.startContainer.parentElement?.id !== "content"
    ? range.startContainer.parentElement
    : null;

  const isParentHighlighted = parent &&
    validCssClasses.some((clazz) => parent.classList.contains(clazz));

  if (!parent) {
    // Surround text with a new highlight <span>
    range.surroundContents(createSpan(cssClass));

  } else if (!isParentHighlighted && parent.tagName !== "A") { // having "DIV" or "SPAN" or other parent which is not highlighted
    // Surround text with a new highlight <span>
    range.surroundContents(createSpan(cssClass));

  } else if (!isParentHighlighted && parent.tagName === "A") { // having "A" parent which is not highlighted
    parent.classList.add(cssClass);

  } else { // having a highlighted parent
    const shouldResetClass = parent.classList.contains(cssClass) // applying already applied CSS class should remove it
      || cssClass === "my-notes-text-color-auto"; // auto should remove any applied CSS class

    if (shouldResetClass) { // removing CSS class
      if (parent.tagName === "A") {
        parent.classList.remove(...validCssClasses);

      } else { // parent is other than "A"
        // Replace parent highlight <span> with text (removes highlight style)
        const superParent = parent.parentNode;
        parent.replaceWith(parent.innerText);
        superParent?.normalize(); // join consecutive TEXT_NODEs into one TEXT_NODE (this is a needed cleanup as highlight requires startContainer and endContainer to be the same TEXT_NODE)
      }

    } else { // changing CSS class
      if (parent.tagName === "A") {
        parent.classList.remove(...validCssClasses);
        parent.classList.add(cssClass);

      } else {
        // Replace parent highlight <span> with new highlight <span> (changes highlight style)
        parent.replaceWith(createSpan(cssClass, parent.innerText));
      }
    }
  }

  __range.empty(); // Deselect the text

  cb(); // Save the note
});

export default highlight;
