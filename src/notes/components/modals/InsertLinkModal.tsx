import { h } from "preact";
import Modal from "./Modal";

export interface InsertLinkModalProps {
  onCancel: () => void
  onConfirm: (href: string) => void
}

const InsertLinkModal = ({ onCancel, onConfirm }: InsertLinkModalProps): h.JSX.Element => (
  <Modal
    className="with-border"
    title="Link URL"
    input
    cancelValue="Cancel"
    confirmValue="Insert"
    validate={(href) => href.length > 0}
    onCancel={onCancel}
    onConfirm={onConfirm}
    description={(
      <div className="modal-description">
        The link can start with <span class="url">http</span>, <span class="url">https</span>, or <span class="url">chrome-extension</span> if referencing another note.
        <br /><br />
        See <strong>Shortcuts</strong> for how to open the inserted link.
      </div>
    )}
  />
);

export default InsertLinkModal;
