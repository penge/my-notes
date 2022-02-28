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
    input={{
      type: "text",
    }}
    validate={validate}
    cancel={onCancel && {
      cancelValue: "Cancel",
      onCancel,
    }}
    confirm={{
      confirmValue: "Create",
      onConfirm,
    }}
  />
);

export default NewNoteModal;
