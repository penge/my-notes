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
    input
    inputValue={noteName}
    cancelValue="Cancel"
    confirmValue="Rename"
    validate={validate}
    onCancel={onCancel}
    onConfirm={onConfirm}
  />;

export default RenameNoteModal;
