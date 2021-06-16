import { h } from "preact";

interface SVGProps {
  text: string
}

const SVG = ({ text }: SVGProps): h.JSX.Element => {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const elem = doc.documentElement;

  const { innerHTML } = elem;

  const width = elem.getAttribute("width") || undefined;
  const height = elem.getAttribute("height") || undefined;
  const viewBox = elem.getAttribute("viewBox") || undefined;

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      dangerouslySetInnerHTML={{ __html: innerHTML }} />
  );
};

export default SVG;
