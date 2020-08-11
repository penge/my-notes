import { syncNow } from "./elements.js";
import formatDate from "../../shared/date/format-date.js";

const title = syncNow.title;

export default function setSync(sync) {
  if (typeof sync !== "object" || !sync.lastSync) {
    syncNow.classList.add("disabled");
    syncNow.title = "Google Drive Sync is disabled (see Options).";
    return;
  }

  const date = formatDate(sync.lastSync);
  syncNow.title = title + "\n\n" + "Last sync: " + date;
  syncNow.classList.remove("disabled");
}
