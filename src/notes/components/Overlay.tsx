import { h } from "preact";
import { useBodyClass } from "notes/hooks/use-body-class";

interface OverlayProps {
  type: "to-rename" | "to-delete" | "to-create"
}

const Overlay = ({ type }: OverlayProps): h.JSX.Element => {
  useBodyClass("with-overlay");

  return <div id="overlay" className={type}></div>;
};

export default Overlay;
