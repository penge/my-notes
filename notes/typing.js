import edit from "./edit.js";

const initialize = (content, tabId) => {
  content.addEventListener("keyup", () => edit(content, tabId));
};

export default { initialize };
