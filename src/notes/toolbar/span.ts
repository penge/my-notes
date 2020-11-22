export const createSpan = (text: string, clazz: string): HTMLSpanElement => {
  const span = document.createElement("span");
  span.innerText = text;
  span.className = clazz;
  return span;
};
