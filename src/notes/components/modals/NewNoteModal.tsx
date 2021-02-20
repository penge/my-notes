import { h } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
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
