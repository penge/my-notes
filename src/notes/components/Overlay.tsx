import { h } from "preact";
import { useEffect } from "preact/hooks";

interface OverlayProps {
  type: "to-rename" | "to-delete" | "to-create"
}

const Overlay = ({ type }: OverlayProps): h.JSX.Element => {
  useEffect(() => {
    document.body.classList.add("with-overlay", type);
    return () => {
      document.body.classList.remove("with-overlay", type);
    };
  }, []);

  return <div id="overlay"></div>;
};

export default Overlay;
