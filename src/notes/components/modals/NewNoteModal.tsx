import { h } from "preact";
import { tString } from "i18n";
import Modal from "./Modal";

export interface NewNoteModalProps {
  validate: (newNoteName: string) => boolean
  onCancel?: () => void
  onConfirm: (newNoteName: string) => void
}

const NewNoteModal = ({ validate, onCancel, onConfirm }: NewNoteModalProps): h.JSX.Element => (
  <Modal
    title={tString("New note")}
    input={{
      type: "text",
    }}
    validate={validate}
    cancel={onCancel && {
      cancelValue: tString("Cancel"),
      onCancel,
    }}
    confirm={{
      confirmValue: tString("Create"),
      onConfirm,
    }}
  />
);

export default NewNoteModal;
