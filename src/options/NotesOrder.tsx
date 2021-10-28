import { h, Fragment } from "preact";
import { NotesOrder as NotesOrderEnum } from "shared/storage/schema";

interface OrderProps {
  notesOrder: NotesOrderEnum
}

const NotesOrder = ({ notesOrder }: OrderProps): h.JSX.Element => (
  <Fragment>
    <h2>Order</h2>
    <p>
      <span>Current order: </span>
      <select
        class="select"
        value={notesOrder}
        onChange={(event) => {
          const newNotesOrder = (event.target as HTMLSelectElement).value as NotesOrderEnum;
          chrome.storage.local.set({ notesOrder: newNotesOrder });
        }}
      >
        <option value={NotesOrderEnum.Alphabetical}>Alphabetical</option>
        <option value={NotesOrderEnum.NewestFirst}>Newest first</option>
        <option value={NotesOrderEnum.Custom}>Custom</option>
      </select>
    </p>
    <p>When <b>"Custom"</b> is selected, you can <b>Drag & Drop</b> notes to change their order.</p>
  </Fragment>
);

export default NotesOrder;
