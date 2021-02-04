import { h } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
import Modal from "./Modal";

export interface InsertImageModalProps {
  onCancel: () => void
  onConfirm: (src: string) => void
}

const InsertImageModal = ({ onCancel, onConfirm }: InsertImageModalProps): h.JSX.Element => (
  <Modal
    className="with-border"
    title="Image URL"
    input
    cancelValue="Cancel"
    confirmValue="Insert"
    validate={(src) => src.length > 0}
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);

export default InsertImageModal;
