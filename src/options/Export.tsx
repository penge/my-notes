import { h, Fragment } from "preact";
import clsx from "clsx";
import { exportNotes } from "notes/export";

let locked = false;

interface ExportProps {
  canExport: boolean
}

const Export = ({ canExport }: ExportProps): h.JSX.Element => (
  <Fragment>
    <h2>Export</h2>
    <input
      type="button"
      class={clsx("bold", "button", !canExport && "disabled")}
      value="Export all notes"
      onClick={() => {
        if (!canExport || locked) {
          return;
        }

        locked = true;
        exportNotes();
        window.setTimeout(() => locked = false, 1000);
      }}
    />
  </Fragment>
);

export default Export;
