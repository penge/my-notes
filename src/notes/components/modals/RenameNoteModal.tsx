import { h } from "preact";
import Modal from "./Modal";
import { tString } from "i18n";

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
      cancelValue: tString("Cancel"),
      onCancel,
    }}
    confirm={{
      confirmValue: tString("Rename"),
      onConfirm,
    }}
  />;

export default RenameNoteModal;
