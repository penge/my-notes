import { RegularFont, GoogleFont } from "shared/storage/schema";
import { googleFonts } from "./elements";

export default function setFont(font: RegularFont | GoogleFont): void {
  if ((font as GoogleFont).href) { googleFonts.href = (font as GoogleFont).href; }
  document.body.style.fontFamily = font.fontFamily;
}
