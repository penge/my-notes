import { h } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
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
        Link can start with <span class="hotlink">http</span>, <span class="hotlink">https</span>, or <span class="hotlink">chrome-extension</span> if referencing other note.
        <br /><br />
        See <strong>Hotkeys</strong> for how to open the inserted link.
      </div>
    )}
  />
);

export default InsertLinkModal;