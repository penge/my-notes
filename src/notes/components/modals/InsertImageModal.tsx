import { h } from "preact";
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
  const googleLinkMatch = src.match(new RegExp("https://drive.google.com/file/d/(.*)/view"));
  if (googleLinkMatch) {
    return `https://drive.google.com/uc?id=${googleLinkMatch[1]}`;
  }

  return src;
};

const InsertImageModal = ({ onCancel, onConfirm }: InsertImageModalProps): h.JSX.Element => (
  <Modal
    className="with-border"
    title="Image URL"
    input
    cancelValue="Cancel"
    confirmValue="Insert"
    validate={(src) => src.length > 0}
    onCancel={onCancel}
    onConfirm={(src) => onConfirm(transformImageUrl(src))}
    description={(
      <div className="modal-description">
        You can <strong>Drag & Drop</strong> an image to the note to upload it to Google Drive when Google Drive Sync is enabled.
      </div>
    )}
  />
);

export default InsertImageModal;
