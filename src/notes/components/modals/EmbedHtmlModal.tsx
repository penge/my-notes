import { h } from "preact";
import Modal from "./Modal";

export interface EmbedHtmlModalProps {
  onCancel: () => void
  onConfirm: (html: string) => void
}

const EmbedHtmlModal = ({ onCancel, onConfirm }: EmbedHtmlModalProps): h.JSX.Element => (
  <Modal
    className="with-border"
    title="Embed HTML"
    input={{
      type: "textarea",
    }}
    validate={(html) => html.length > 0}
    cancel={{
      cancelValue: "Cancel",
      onCancel,
    }}
    confirm={{
      confirmValue: "Embed",
      onConfirm,
    }}
  />
);

export default EmbedHtmlModal;
