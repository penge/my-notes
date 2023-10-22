import { RegularFont, GoogleFont } from "shared/storage/schema";

export interface FontFamily {
  id: string
  name: string
  fonts?: string[]
}

export const fontFamilies: FontFamily[] = [
  {
    id: "serif",
    name: "Serif",
    fonts: [
      "Georgia",
      "Palatino Linotype",
      "Times New Roman",
      "Times",
    ],
  },
  {
    id: "sans-serif",
    name: "Sans Serif",
    fonts: [
      "Arial",
      "Arial Black",
      "Comic Sans MS",
      "Helvetica",
      "Impact",
      "Lucida Sans Unicode",
      "Roboto",
      "Tahoma",
      "Trebuchet MS",
      "Verdana",
    ],
  },
  {
    id: "monospace",
    name: "Monospace",
    fonts: [
      "Courier",
      "Courier New",
      "Lucida Console",
      "Monaco",
    ],
  },
  {
    id: "google-fonts",
    name: "Google Fonts",
  },
];

export const findFontFamily = (font: RegularFont | GoogleFont): FontFamily => (
  fontFamilies.find((family) => family.id === (font as RegularFont).genericFamily)
  || fontFamilies.find((family) => family.id === "google-fonts")
) as FontFamily;

export const getGoogleFontName = (font: RegularFont | GoogleFont): string => (
  (font as GoogleFont).href ? (font as GoogleFont).name : ""
);

export const getGoogleFontHref = (fontName: string): string => {
  // "Roboto Mono" -> "Roboto+Mono"
  const family = fontName.replace(" ", "+");

  // 400 = Normal font weight
  // 700 = Bold font weight
  // swap = use fallback font until Google Font is downloaded
  const href = `https://fonts.googleapis.com/css?family=${family}:400,700&display=swap`;
  return href;
};

// "Roboto Mono" -> "roboto-mono"
export const ideizeFont = (fontName: string): string => fontName.toLowerCase().replace(/\s/g, "-");
