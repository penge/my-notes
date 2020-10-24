import edit from "./edit";

const initialize = (content: HTMLElement, tabId: string): void => {
  content.addEventListener("input", () => edit(content, tabId));
};

export default { initialize };
