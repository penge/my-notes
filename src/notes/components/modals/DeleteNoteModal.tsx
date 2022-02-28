import { h } from "preact";
import Modal from "./Modal";

export interface DeleteNoteModalProps {
  noteName: string
  onCancel: () => void
  onConfirm: () => void
}

const DeleteNoteModal = ({ noteName, onCancel, onConfirm }: DeleteNoteModalProps): h.JSX.Element => (
  <Modal
    title={`Delete ${noteName}?`}
    cancel={{
      cancelValue: "No",
      onCancel,
    }}
    confirm={{
      confirmValue: "Yes",
      onConfirm,
    }}
  />
);

export default DeleteNoteModal;
