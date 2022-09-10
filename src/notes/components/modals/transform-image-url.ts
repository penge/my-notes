// Transforms Google Drive image url
// - from: https://drive.google.com/file/d/1y0...v9S/view
// - to: https://drive.google.com/uc?id=1y0...v9S
// otherwise keeps the url unchanged.
export default (src: string): string => {
  const googleLinkMatch = src.match(/https:\/\/drive.google.com\/file\/d\/(.*)\/view/);
  if (googleLinkMatch) {
    return `https://drive.google.com/uc?id=${googleLinkMatch[1]}`;
  }

  return src;
};
