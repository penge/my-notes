import { h, Fragment } from "preact";
import { useRef, useCallback, useEffect, useState } from "preact/hooks";
import clsx from "clsx";
import { Os, Sync, MessageType, NotesObject } from "shared/storage/schema";
import Drag from "./Drag";
import keyboardShortcuts, { KeyboardShortcut } from "notes/keyboard-shortcuts";
import formatDate from "shared/date/format-date";
import { sendMessage } from "messages";
import Tooltip from "./Tooltip";
import { importNoteFromTxtFile } from "notes/import";

import FileSvgText from "svg/file.svg";
import GearSvgText from "svg/gear.svg";
import RefreshSvgText from "svg/refresh.svg";
import LockSvgText from "svg/lock.svg";
import SVG from "types/SVG";

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

interface SidebarProps {
  os?: Os
  notes: NotesObject
  active: string
  width?: string
  onActivateNote: (noteName: string) => void
  onNoteContextMenu: (noteName: string, x: number, y: number) => void
  onNewNote: () => void
  sync?: Sync
}

const Sidebar = ({
  os, notes, active, width, onActivateNote, onNoteContextMenu, onNewNote, sync,
}: SidebarProps): h.JSX.Element => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [dragOverNote, setDragOverNote] = useState<string | null>(null);
  const [dragOverNoteConfirmation, setDragOverNoteConfirmation] = useState<string | null>(null);

  const [enteredNote, setEnteredNote] = useState<string | null>(null);
  const enteredNoteRef = useRef<string | null>(null);
  enteredNoteRef.current = enteredNote;

  const [dragOverButtons, setDragOverButtons] = useState<boolean>(false);

  const openOptions = useCallback(() => chrome.runtime.openOptionsPage(), []);
  const openEnteredNote = useCallback(() => {
    if (!document.body.classList.contains("with-control")) {
      return;
    }

    const note = enteredNoteRef.current;
    if (!note || note === active) {
      return;
    }

    onActivateNote(note);
  }, [onActivateNote]);

  useEffect(openEnteredNote, [enteredNote]);
  useEffect(() => {
    keyboardShortcuts.subscribe(KeyboardShortcut.OnControl, () => {
      document.body.classList.add("with-control");
      openEnteredNote();
    });
  }, []);

  useEffect(() => {
    setDragOverNote(null);
    setDragOverNoteConfirmation(null);
  }, [active]);

  return (
    <div id="sidebar" ref={sidebarRef} style={{
      width: width,
      minWidth: width,
    }}>
      <div id="sidebar-notes" class="notes">
        {Object.keys(notes).map((noteName) =>
          <div
            class={clsx(
              "note",
              noteName === active && "active",
              noteName === dragOverNote && "drag-over",
              noteName === dragOverNoteConfirmation && "drag-confirmation",
            )}
            onClick={() => onActivateNote(noteName)}
            onMouseEnter={() => setEnteredNote(noteName)}
            onMouseLeave={() => setEnteredNote(null)}
            onContextMenu={(event) => {
              event.preventDefault();
              onActivateNote(noteName);
              onNoteContextMenu(noteName, event.pageX, event.pageY);
            }}
            onDragOver={(event) => {
              if (notes[noteName].locked) {
                return;
              }
              event.preventDefault();
              setDragOverNote(noteName);
              setDragOverNoteConfirmation(null);
            }}
            onDragLeave={(event) => {
              if (notes[noteName].locked) {
                return;
              }
              event.preventDefault();
              setDragOverNote(null);
            }}
            onDrop={(event) => {
              if (notes[noteName].locked) {
                return;
              }
              event.preventDefault();
              const data = event.dataTransfer?.getData("text");
              if (data) {
                sendMessage(MessageType.DROP, {
                  targetNoteName: noteName,
                  data,
                });
                setDragOverNoteConfirmation(noteName);
              }
              setDragOverNote(null);
            }}
          >
            {noteName}
            {notes[noteName].locked && <SVG text={LockSvgText} />}
          </div>
        )}
      </div>

      <div
        id="sidebar-buttons"
        class={clsx("bar", dragOverButtons && "drag-over")}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOverButtons(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragOverButtons(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer?.files[0];
          if (!file) {
            setDragOverButtons(false);
            return;
          }

          importNoteFromTxtFile(file, () => setDragOverButtons(false));
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
            onClick={() => sendMessage(MessageType.SYNC)}
          >
            <SVG text={RefreshSvgText} />
          </div>
        </Tooltip>
      </div>

      <Drag sidebar={sidebarRef} />
    </div>
  );
};

export default Sidebar;
