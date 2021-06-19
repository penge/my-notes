import { h } from "preact";
import Modal from "./Modal";

export interface DeleteNoteModalProps {
  noteName: string
  onCancel: () => void
  onConfirm: (newNoteName: string) => void
}

const DeleteNoteModal = ({ noteName, onCancel, onConfirm }: DeleteNoteModalProps): h.JSX.Element => (
  <Modal
    title={`Delete ${noteName}?`}
    cancelValue="No"
    confirmValue="Yes"
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);

export default DeleteNoteModal;
