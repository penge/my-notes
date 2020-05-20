/* global document */

import {
  currentFontName,
  fontCategories,
  fontAreas,
  fontNameInput,
} from "./elements.js";

export function setCurrentFontNameText(font) {
  currentFontName.innerText = font.name;
  fontNameInput.value = font.href ? font.name : "";
}

export function displayFontCategory(id) { // id example: "serif"
  for (const category of fontCategories) { // "serif"
    category.classList.toggle("active", category.id === id);
  }

  for (const area of fontAreas) { // "serif-area"
    area.classList.toggle("hide", area.id !== id + "-area");
  }
}

export function checkById(id) { // id example: "courier-new"
  const element = document.getElementById(id);
  // Radio does not exist in case of "Google Fonts"
  if (element) { element.checked = true; }
}

export function uncheckAll(radios) {
  radios.forEach(radio => {
    radio.checked = false;
  });
}
