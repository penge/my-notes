export function getGoogleFontHref(fontName: string): string {
  // "Roboto Mono" -> "Roboto+Mono"
  const family = fontName.replace(" ", "+");

  // 400 = Normal font weight
  // 700 = Bold font weight
  // swap = use fallback font until Google Font is downloaded
  const href = `https://fonts.googleapis.com/css?family=${family}:400,700&display=swap`;
  return href;
}
