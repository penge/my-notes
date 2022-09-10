import { h } from "preact";
import { t, tString } from "i18n";
import Modal from "./Modal";
import transformImageUrl from "./transform-image-url";

export interface InsertImageModalProps {
  onCancel: () => void
  onConfirm: (src: string) => void
}

const InsertImageModal = ({ onCancel, onConfirm }: InsertImageModalProps): h.JSX.Element => (
  <Modal
    className="with-border"
    title={tString("Image URL")}
    input={{
      type: "text",
    }}
    validate={(src) => src.length > 0}
    cancel={{
      cancelValue: tString("Cancel"),
      onCancel,
    }}
    confirm={{
      confirmValue: tString("Insert"),
      onConfirm: (src) => onConfirm(transformImageUrl(src)),
    }}
    description={(
      <div className="modal-description">
        {t("Insert Image description")}
      </div>
    )}
  />
);

export default InsertImageModal;
