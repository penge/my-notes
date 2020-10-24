/* global document */

export const createSpan = (text, clazz) => {
  const span = document.createElement("span");
  span.innerText = text;
  span.className = clazz;
  return span;
};
