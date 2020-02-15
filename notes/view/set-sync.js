import { syncContainer, lastSync, openInGoogleDrive } from "./elements.js";
import { hide, show } from "./visibility.js";
import formatDate from "../../shared/date/format-date.js";

export default function setSync(sync) {
  if (!sync) {
    hide(syncContainer);
    lastSync.innerText = "";
    openInGoogleDrive.href = "";
    return;
  }

  lastSync.innerText = sync.lastSync ? formatDate(sync.lastSync) : "In progress...";
  openInGoogleDrive.href = sync.folderLocation;

  show(syncContainer);
}
