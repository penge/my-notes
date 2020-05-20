/* global document */

import { googleFonts } from "./elements.js";

export default function setFont(font) {
  if (font.href) { googleFonts.href = font.href; }
  document.body.style.fontFamily = font.fontFamily;
}
