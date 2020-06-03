// Get selected objects (exclude their inner objects)
function getSelectedOuterObjects() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return [];

    const range = selection.getRangeAt(0);
    const selectedObjects = [];
    const traversedDomObjects = [];

    const _iterator = document.createNodeIterator(
        range.commonAncestorContainer,
        NodeFilter.SHOW_ALL, // pre-filter
        { acceptNode: node => NodeFilter.FILTER_ACCEPT }
    );

    while (_iterator.nextNode()) {
        let node = _iterator.referenceNode;
        if (selectedObjects.length === 0 && node !== range.startContainer) {
            continue;
        }
        if (node === range.endContainer) break;

        // Skip internal objects
        if (! traversedDomObjects.includes(node.parentNode)) {
            if (typeof node.style === 'undefined') { // text node
                node = node.parentNode;
            }
            selectedObjects.push(node);
        }
        traversedDomObjects.push(node);
    }
    // If nothing found, add cursor containing obj
    if (selectedObjects.length === 0) {
        selectedObjects.push(range.startContainer.parentNode);
    }
    return selectedObjects;
}

function changeObjectStyle(domObj, styleObj) {
    for (let [key, value] of Object.entries(styleObj)) {
        domObj.style[key] = value;
    }
}

const changeStyle = styleObj => {
    for (const obj of getSelectedOuterObjects()) {
        changeObjectStyle(obj, styleObj);
    }
    return true;
};

export {
    getSelectedOuterObjects,
    changeStyle
};
