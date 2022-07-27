import { h } from "preact";
import { tString } from "i18n";
import Modal from "./Modal";

export interface EmbedHtmlModalProps {
  onCancel: () => void
  onConfirm: (html: string) => void
}

const EmbedHtmlModal = ({ onCancel, onConfirm }: EmbedHtmlModalProps): h.JSX.Element => (
  <Modal
    className="with-border"
    title={tString("Embed HTML")}
    input={{
      type: "textarea",
    }}
    validate={(html) => html.length > 0}
    cancel={{
      cancelValue: tString("Cancel"),
      onCancel,
    }}
    confirm={{
      confirmValue: tString("Embed"),
      onConfirm,
    }}
  />
);

export default EmbedHtmlModal;
