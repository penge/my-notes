import commonFonts from "./common-fonts";
import { getFontId } from "./font-helpers";

// Render commonFonts into #commonfonts
// #font-area-template from options.html is used
export const renderCommonFonts = (): void => {
  const generics = Object.keys(commonFonts);
  const fragment = document.createDocumentFragment();
  const template = document.getElementById("font-area-template") as HTMLTemplateElement;
  for (const generic of generics) {
    const node = template.content.cloneNode(true) as Element;
    const fontArea = node.children[0];
    fontArea.id = generic + "-area"; // "monospace-area"

    const selections = document.createDocumentFragment();
    for (const fontName of commonFonts[generic]) {
      const selection = fontArea.children[0].cloneNode(true) as Element;
      const input = selection.children[0] as HTMLInputElement;
      const label = selection.children[1] as HTMLLabelElement;

      // "Courier New" -> "courier-new"
      const fontId = getFontId(fontName);

      // "Courier New,monospace"
      const fontFamily = [fontName,generic].join(",");

      // <input type="radio" id="" name="font" value="" data-generic="" style="">
      input.id = fontId;
      input.value = fontName;
      input.dataset.generic = generic;
      input.style.fontFamily = fontFamily;

      // <label for="" style="">The quick brown fox jumps over the lazy dog (<span>fontName</span>)</label>
      label.htmlFor = fontId;
      label.style.fontFamily = fontFamily;
      (label.children[0] as HTMLElement).innerText = fontName;

      selections.appendChild(selection);
    }
    fontArea.removeChild(fontArea.children[0]);
    fontArea.appendChild(selections);
    fragment.appendChild(node);
  }

  const commonFontsElem = document.getElementById("commonfonts") as Element;
  commonFontsElem.innerHTML = "";
  commonFontsElem.appendChild(fragment);
};
