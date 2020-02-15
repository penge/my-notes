/* global document */

export default function setFocus(focus) {
  document.body.classList.toggle("focus", focus);
}
