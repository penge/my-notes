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
    name: "Google Fonts"
  }
];

export const ideizeFont = (fontName: string): string =>
  // "Roboto Mono" -> "roboto-mono"
  fontName.toLowerCase().replace(/\s/g, "-");

export const getGoogleFontHref = (fontName: string): string => {
  // "Roboto Mono" -> "Roboto+Mono"
  const family = fontName.replace(" ", "+");

  // 400 = Normal font weight
  // 700 = Bold font weight
  // swap = use fallback font until Google Font is downloaded
  const href = `https://fonts.googleapis.com/css?family=${family}:400,700&display=swap`;
  return href;
};
