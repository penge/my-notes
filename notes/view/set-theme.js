/* global document */

// Theme can be:
// - "light"
// - "dark"
// - "custom"
export default function setTheme(theme) {
  document.body.id = theme;
}
