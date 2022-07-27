import { h } from "preact";
import { t, tString } from "i18n";
import Modal from "./Modal";

export interface InsertImageModalProps {
  onCancel: () => void
  onConfirm: (src: string) => void
}

// Transforms Google Drive image url
// - from: https://drive.google.com/file/d/1y0...v9S/view
// - to: https://drive.google.com/uc?id=1y0...v9S
// otherwise keeps the url unchanged.
export const transformImageUrl = (src: string): string => {
  const googleLinkMatch = src.match(/https:\/\/drive.google.com\/file\/d\/(.*)\/view/);
  if (googleLinkMatch) {
    return `https://drive.google.com/uc?id=${googleLinkMatch[1]}`;
  }

  return src;
};

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
