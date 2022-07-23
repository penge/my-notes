import { h, Fragment } from "preact";
import { NotesOrder as NotesOrderEnum } from "shared/storage/schema";
import { t } from "i18n";

interface OrderProps {
  notesOrder: NotesOrderEnum
}

const NotesOrder = ({ notesOrder }: OrderProps): h.JSX.Element => (
  <Fragment>
    <h2>{t("Order")}</h2>
    <p>
      <span>
        {t("Current order:")}
        {" "}
      </span>
      <select
        className="select"
        value={notesOrder}
        onChange={(event) => {
          const newNotesOrder = (event.target as HTMLSelectElement).value as NotesOrderEnum;
          chrome.storage.local.set({ notesOrder: newNotesOrder });
        }}
      >
        {[
          NotesOrderEnum.Alphabetical,
          NotesOrderEnum.NewestFirst,
          NotesOrderEnum.Custom,
        ].map((oneOrder) => <option value={oneOrder}>{t(`Orders.${oneOrder}`)}</option>)}
      </select>
    </p>
    <p>{t("Orders description")}</p>
  </Fragment>
);

export default NotesOrder;
