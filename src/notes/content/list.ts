// eslint-disable-next-line import/prefer-default-export
export const insideListItem = ({ canBeFirstDescendant }: { canBeFirstDescendant: boolean }) => {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) {
    return false;
  }

  const LIST_TAGS = ["UL", "OL"];
  const ancestor = selection.getRangeAt(0).commonAncestorContainer;
  const closestList = LIST_TAGS.includes((ancestor as HTMLOListElement | HTMLUListElement).tagName)
    ? ancestor
    : ancestor.parentElement?.closest(LIST_TAGS.join(","));

  return canBeFirstDescendant
    ? closestList != null
    : LIST_TAGS.includes(closestList?.parentElement?.tagName || "");
};
