import edit from "./edit.js";

const initialize = (content, tabId) => {
  content.addEventListener("input", () => edit(content, tabId));
};

export default { initialize };
