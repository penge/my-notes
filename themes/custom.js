/* global document */

export function initCustomTheme({background, text}) {
  const themeVariables = document.getElementById("theme-variables");
  themeVariables.innerHTML = `:root{--background:${background};--text:${text};}`;
}
