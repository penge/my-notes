import { h } from "preact";
import Modal from "./Modal";
import { t, tString } from "i18n";

export interface InsertLinkModalProps {
  onCancel: () => void
  onConfirm: (href: string) => void
}

const InsertLinkModal = ({ onCancel, onConfirm }: InsertLinkModalProps): h.JSX.Element => (
  <Modal
    className="with-border"
    title={tString("Link URL")}
    input={{
      type: "text",
    }}
    validate={(href) => href.length > 0}
    cancel={{
      cancelValue: tString("Cancel"),
      onCancel,
    }}
    confirm={{
      confirmValue: tString("Insert"),
      onConfirm,
    }}
    description={(
      <div className="modal-description">
        {t("Insert Link description.line1", {
          http: "<span class=\"url\">http</span>",
          https: "<span class=\"url\">https</span>",
          "chrome-extension": "<span class=\"url\">chrome-extension</span>",
        })}

        <br /><br />

        {t("Insert Link description.line2")}
      </div>
    )}
  />
);

export default InsertLinkModal;
