import { h } from "preact";
import Modal from "./Modal";

export interface NewNoteModalProps {
  validate: (newNoteName: string) => boolean
  onCancel?: () => void
  onConfirm: (newNoteName: string) => void
}

const NewNoteModal = ({ validate, onCancel, onConfirm }: NewNoteModalProps): h.JSX.Element => (
  <Modal
    title="New note"
    input
    cancelValue="Cancel"
    confirmValue="Create"
    validate={validate}
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);

export default NewNoteModal;
