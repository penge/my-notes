import { h } from "preact";

const SVG = (loadedText: string) => (): h.JSX.Element => {
  const doc = new DOMParser().parseFromString(loadedText, "application/xml");
  const elem = doc.documentElement;

  const { innerHTML } = elem;

  const width = elem.getAttribute("width") || "";
  const height = elem.getAttribute("height") || "";
  const viewBox = elem.getAttribute("viewBox") || "";

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      dangerouslySetInnerHTML={{ __html: innerHTML }} />
  );
};

export default SVG;
