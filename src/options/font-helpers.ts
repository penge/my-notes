export const getFontId = (fontName: string): string =>
  // "Roboto Mono" -> "roboto-mono"
  fontName.toLowerCase().replace(" ", "-");

export const getFontFamily = (fontName: string): string => {
  // <span> element is used to set "fontFamily" to it
  // and then get it back in an improved format
  //
  // Example: if setting 'Roboto Mono, monospace',
  // it will be set as '"Roboto Mono", monospace'
  // (quotes are added on set)
  //
  // Quotes are added around the font name if it contains whitespace
  // Quotes are not necessary, it is just a recommended convention
  const span = document.createElement("span");
  span.style.fontFamily = fontName; // '"Roboto Mono"'
  return span.style.fontFamily;
};
