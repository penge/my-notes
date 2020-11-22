import { GoogleFont, RegularFont } from "shared/storage/schema";
import {
  currentFontName,
  fontCategories,
  fontAreas,
  fontNameInput,
} from "./elements";

export function setCurrentFontNameText(font: RegularFont | GoogleFont): void {
  currentFontName.innerText = font.name;
  fontNameInput.value = (font as GoogleFont).href ? font.name : "";
}

export function displayFontCategory(id: string): void { // id example: "serif"
  for (const category of fontCategories) { // "serif"
    category.classList.toggle("active", category.id === id);
  }

  for (const area of fontAreas) { // "serif-area"
    area.classList.toggle("hide", area.id !== id + "-area");
  }
}

export function checkById(id: string): void { // id example: "courier-new"
  const element = document.getElementById(id);
  // Radio does not exist in case of "Google Fonts"
  if (element) { (element as HTMLInputElement).checked = true; }
}

export function uncheckAll(radios: NodeListOf<HTMLInputElement>): void {
  radios.forEach(radio => {
    radio.checked = false;
  });
}
