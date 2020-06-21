import { syncNow } from "./elements.js";
import formatDate from "../../shared/date/format-date.js";

const title = syncNow.title;

export default function setSync(sync) {
  if (typeof sync !== "object") {
    syncNow.classList.add("hide");
    return;
  }

  syncNow.classList.remove("hide");
  if (sync.lastSync) {
    const date = formatDate(sync.lastSync);
    syncNow.title = title + "\n\n" + "Last sync: " + date;
  }
}
