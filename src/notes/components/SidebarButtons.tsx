import { h, Fragment } from "preact";
import { useState, useCallback } from "preact/hooks";
import { Os, Sync, MessageType } from "shared/storage/schema";
import clsx from "clsx";
import { t } from "i18n";
import SVG from "notes/components/SVG";
import FileSvgText from "svg/file.svg";
import GearSvgText from "svg/gear.svg";
import RefreshSvgText from "svg/refresh.svg";
import { importNoteFromTextFile } from "notes/import";
import sendMessage from "shared/messages/send";
import formatDate from "shared/date/format-date";
import Tooltip from "./Tooltip";

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
      className={clsx("bar", dragOver && "drag-over")}
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

        importNoteFromTextFile(file).then(() => setDragOver(false));
      }}
    >
      <Tooltip tooltip={t("New note")}>
        <div id="new-note" className="button" onClick={onNewNote}>
          <SVG text={FileSvgText} />
        </div>
      </Tooltip>

      <Tooltip tooltip={t("Options")}>
        <div id="open-options" className="button" onClick={openOptions}>
          <SVG text={GearSvgText} />
        </div>
      </Tooltip>

      <Tooltip
        id="sync-now-tooltip"
        tooltip={
          (sync && sync.lastSync)
            ? (
              <Fragment>
                <div>{t(`Click to sync notes to and from Google Drive.${os}`)}</div>
                <div>{t("Last sync", { time: formatDate(sync.lastSync) })}</div>
              </Fragment>
            )
            : t("Google Drive Sync is disabled (see Options)")
        }
      >
        <div
          id="sync-now"
          className={clsx("button", (!sync || !sync.lastSync) && "disabled")}
          onClick={() => sync && sendMessage(MessageType.SYNC)}
        >
          <SVG text={RefreshSvgText} />
        </div>
      </Tooltip>
    </div>
  );
};

export default SidebarButtons;
