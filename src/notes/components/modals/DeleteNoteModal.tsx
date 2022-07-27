import { h } from "preact";
import { tString } from "i18n";
import Modal from "./Modal";

export interface DeleteNoteModalProps {
  noteName: string
  onCancel: () => void
  onConfirm: () => void
}

const DeleteNoteModal = ({ noteName, onCancel, onConfirm }: DeleteNoteModalProps): h.JSX.Element => (
  <Modal
    title={tString("Delete note", { note: noteName })}
    cancel={{
      cancelValue: tString("No"),
      onCancel,
    }}
    confirm={{
      confirmValue: tString("Yes"),
      onConfirm,
    }}
  />
);

export default DeleteNoteModal;
