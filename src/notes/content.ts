const CONTENT_ID = "content";

const createIterator = (range: Range): NodeIterator => {
  const root = range.commonAncestorContainer;
  const whatToShow = NodeFilter.SHOW_TEXT;
  const filter = {
    acceptNode: (node: Node) => {
      const intersectsNode = range.intersectsNode(node);
      return intersectsNode ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  };

  const iterator = document.createNodeIterator(root, whatToShow, filter);
  return iterator;
};

export const getNodes = (range: Range): Node[] => {
  if (!range) {
    return [];
  }

  const iterator = createIterator(range);
  const nodes = [];

  while (iterator.nextNode()) {
    if (nodes.length === 0 && (iterator.referenceNode as HTMLElement).id === CONTENT_ID) {
      continue;
    }

    nodes.push(iterator.referenceNode);
  }

  return nodes;
};
