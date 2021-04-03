import { h, Fragment } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { useRef, useCallback, useEffect, useState } from "preact/hooks";
import clsx from "clsx";
import { NotesObject, Sync, MessageType } from "shared/storage/schema";
import Drag from "./Drag";
import keyboardShortcuts, { KeyboardShortcut } from "notes/keyboard-shortcuts";
import formatDate from "shared/date/format-date";
import { syncNotes } from "notes/content/sync";
import { sendMessage } from "messages";
import Tooltip from "./Tooltip";

const syncNowTitles = {
  mac: (lastSync: string) => (
    <Fragment>
      <div>Click to sync the notes to and from Google Drive now (⌘ + Shift + S)</div>
      <div>Last sync: {formatDate(lastSync)}</div>
    </Fragment>
  ),
  other: (lastSync: string) => (
    <Fragment>
      <div>Click to sync the notes to and from Google Drive now (Ctrl + Shift + S)</div>
      <div>Last sync: {formatDate(lastSync)}</div>
    </Fragment>
  ),
  disabled: "Google Drive Sync is disabled (see Options)",
};

interface SidebarProps {
  os?: "mac" | "other"
  notes: NotesObject
  active: string
  clipboard: string
  width?: string
  onActivateNote: (noteName: string) => void
  onNoteContextMenu: (noteName: string, x: number, y: number) => void
  onNewNote: () => void
  sync?: Sync
}

const Sidebar = ({
  os, notes, active, clipboard, width, onActivateNote, onNoteContextMenu, onNewNote, sync,
}: SidebarProps): h.JSX.Element => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [dragOverNote, setDragOverNote] = useState<string | null>(null);
  const [dragOverNoteConfirmation, setDragOverNoteConfirmation] = useState<string | null>(null);

  const [enteredNote, setEnteredNote] = useState<string | null>(null);
  const enteredNoteRef = useRef<string | null>(null);
  enteredNoteRef.current = enteredNote;

  const openOptions = useCallback(() => chrome.tabs.create({ url: "/options.html" }), []);
  const openEnteredNote = useCallback(() => {
    if (!document.body.classList.contains("with-control")) {
      return;
    }

    const note = enteredNoteRef.current;
    if (!note || note === active) {
      return;
    }

    onActivateNote(note);
  }, []);

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
              event.preventDefault();
              setDragOverNote(noteName);
              setDragOverNoteConfirmation(null);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setDragOverNote(null);
            }}
            onDrop={(event) => {
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
            {noteName === clipboard && (
              <svg viewBox="0 0 415.999 415.999">
                <path d="M335.999,64h-44.423c-5.926-6.583-13.538-11.62-22.284-14.136c-7.368-2.118-13.038-7.788-15.156-15.156
                  C248.371,14.664,229.898,0,208,0c-21.898,0-40.37,14.664-46.136,34.707c-2.121,7.376-7.805,13.039-15.181,15.164
                  c-8.738,2.518-16.342,7.55-22.262,14.129H80C62.327,64,48,78.327,48,96v287.999c0,17.673,14.326,32,31.999,32h255.999
                  c17.674,0,32-14.327,32-32V96C367.999,78.327,353.672,64,335.999,64z M208.205,32c8.837,0,16,7.163,16,16c0,8.836-7.163,16-16,16
                  s-16-7.164-16-16C192.205,39.163,199.368,32,208.205,32z M335.999,383.999H80V96h32v32h192V96h31.999V383.999z"/>
                <polygon points="268.853,188.627 179.882,277.601 142.752,241.257 120.124,263.9 179.882,322.854 291.481,211.256"/>
              </svg>
            )}
          </div>
        )}
      </div>

      <div id="sidebar-buttons" class="bar">
        <Tooltip tooltip="New note">
          <div id="new-note" class="button" onClick={onNewNote}>
            <svg viewBox="0 0 426.667 426.667">
              <path d="M256,0H85.333C61.76,0,42.88,19.093,42.88,42.667L42.667,384c0,23.573,18.88,42.667,42.453,42.667h256.213
                C364.907,426.667,384,407.573,384,384V128L256,0z M234.667,149.333V32L352,149.333H234.667z"/>
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip="Options">
          <div id="open-options" class="button" onClick={openOptions}>
            <svg viewBox="0 0 426.667 426.667">
              <path d="M416.8,269.44l-45.013-35.307c0.853-6.827,1.493-13.76,1.493-20.8s-0.64-13.973-1.493-20.8l45.12-35.307
                c4.053-3.2,5.227-8.96,2.56-13.653L376.8,69.653c-2.667-4.587-8.213-6.507-13.013-4.587l-53.12,21.44
                c-10.987-8.427-23.04-15.573-36.053-21.013l-8-56.533C265.653,3.947,261.28,0,255.947,0h-85.333c-5.333,0-9.707,3.947-10.56,8.96
                l-8,56.533c-13.013,5.44-25.067,12.48-36.053,21.013l-53.12-21.44c-4.8-1.813-10.347,0-13.013,4.587L7.2,143.573
                c-2.667,4.587-1.493,10.347,2.56,13.653l45.013,35.307c-0.853,6.827-1.493,13.76-1.493,20.8s0.64,13.973,1.493,20.8L9.76,269.44
                c-4.053,3.2-5.227,8.96-2.56,13.653l42.667,73.92c2.667,4.587,8.213,6.507,13.013,4.587L116,340.16
                c10.987,8.427,23.04,15.573,36.053,21.013l8,56.533c0.853,5.013,5.227,8.96,10.56,8.96h85.333c5.333,0,9.707-3.947,10.56-8.96
                l8-56.533c13.013-5.44,25.067-12.48,36.053-21.013l53.12,21.44c4.8,1.813,10.347,0,13.013-4.587l42.667-73.92
                C422.027,278.507,420.853,272.747,416.8,269.44z M213.28,288c-41.28,0-74.667-33.387-74.667-74.667S172,138.667,213.28,138.667
                s74.667,33.387,74.667,74.667S254.56,288,213.28,288z"/>
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip={(sync && sync.lastSync) ? (os ? syncNowTitles[os](sync.lastSync) : "") : syncNowTitles.disabled}>
          <div id="sync-now"
            class={clsx("button", (!sync || !sync.lastSync) && "disabled")}
            onClick={() => syncNotes(sync)}
          >
            <svg viewBox="0 0 341.333 341.333">
              <path d="M341.227,149.333V0l-50.133,50.133C260.267,19.2,217.707,0,170.56,0C76.267,0,0.107,76.373,0.107,170.667
                s76.16,170.667,170.453,170.667c79.467,0,146.027-54.4,164.907-128h-44.373c-17.6,49.707-64.747,85.333-120.533,85.333
                c-70.72,0-128-57.28-128-128s57.28-128,128-128c35.307,0,66.987,14.72,90.133,37.867l-68.8,68.8H341.227z"/>
            </svg>
          </div>
        </Tooltip>
      </div>

      <Drag sidebar={sidebarRef} />
    </div>
  );
};

export default Sidebar;
