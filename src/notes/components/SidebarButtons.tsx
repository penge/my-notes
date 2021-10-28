import { h, Fragment } from "preact";
import { useState, useCallback } from "preact/hooks";
import { Os, Sync, MessageType } from "shared/storage/schema";
import clsx from "clsx";
import Tooltip from "./Tooltip";
import SVG from "types/SVG";
import FileSvgText from "svg/file.svg";
import GearSvgText from "svg/gear.svg";
import RefreshSvgText from "svg/refresh.svg";
import { importNoteFromTxtFile } from "notes/import";
import { sendMessage } from "messages";
import formatDate from "shared/date/format-date";

const syncNowTitles = {
  mac: (lastSync: string) => (
    <Fragment>
      <div>Click to sync notes to and from Google Drive (⌘ + R)</div>
      <div>Last sync: {formatDate(lastSync)}</div>
    </Fragment>
  ),
  other: (lastSync: string) => (
    <Fragment>
      <div>Click to sync notes to and from Google Drive (Ctrl + R)</div>
      <div>Last sync: {formatDate(lastSync)}</div>
    </Fragment>
  ),
  disabled: "Google Drive Sync is disabled (see Options)",
};

interface SidebarButtonsProps {
  os?: Os
  sync?: Sync
  onNewNote: () => void
}

const SidebarButtons = ({
  os, sync, onNewNote,
}: SidebarButtonsProps): h.JSX.Element => {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const openOptions = useCallback(() => chrome.runtime.openOptionsPage(), []);

  return (
    <div
      id="sidebar-buttons"
      class={clsx("bar", dragOver && "drag-over")}
      onDragOver={(event) => {
        event.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragOver(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (!file) {
          setDragOver(false);
          return;
        }

        importNoteFromTxtFile(file, () => setDragOver(false));
      }}
    >
      <Tooltip tooltip="New note">
        <div id="new-note" class="button" onClick={onNewNote}>
          <SVG text={FileSvgText} />
        </div>
      </Tooltip>

      <Tooltip tooltip="Options">
        <div id="open-options" class="button" onClick={openOptions}>
          <SVG text={GearSvgText} />
        </div>
      </Tooltip>

      <Tooltip id="sync-now-tooltip" tooltip={(sync && sync.lastSync) ? (os ? syncNowTitles[os](sync.lastSync) : "") : syncNowTitles.disabled}>
        <div id="sync-now"
          class={clsx("button", (!sync || !sync.lastSync) && "disabled")}
          onClick={() => sync && sendMessage(MessageType.SYNC)}
        >
          <SVG text={RefreshSvgText} />
        </div>
      </Tooltip>
    </div>
  );
};

export default SidebarButtons;
