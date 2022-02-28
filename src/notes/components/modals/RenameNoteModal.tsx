import { h } from "preact";
import Modal from "./Modal";

export interface RenameNoteModalProps {
  noteName: string
  validate: (newNoteName: string) => boolean
  onCancel: () => void
  onConfirm: (newNoteName: string) => void
}

const RenameNoteModal = ({ noteName, validate, onCancel, onConfirm }: RenameNoteModalProps): h.JSX.Element =>
  <Modal
    input={{
      type: "text",
      defaultValue: noteName,
    }}
    validate={validate}
    cancel={{
      cancelValue: "Cancel",
      onCancel,
    }}
    confirm={{
      confirmValue: "Rename",
      onConfirm,
    }}
  />;

export default RenameNoteModal;
