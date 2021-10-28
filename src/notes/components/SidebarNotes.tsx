import { Fragment, h } from "preact";
import { useState, useEffect, useCallback, useRef } from "preact/hooks";
import { MessageType } from "shared/storage/schema";
import { SidebarNote } from "notes/adapters";
import clsx from "clsx";
import SVG from "types/SVG";
import LockSvgText from "svg/lock.svg";
import keyboardShortcuts, { KeyboardShortcut } from "notes/keyboard-shortcuts";
import { sendMessage } from "messages";

interface SidebarNotesProps {
  notes: SidebarNote[]
  active: string
  onActivateNote: (noteName: string) => void
  onNoteContextMenu: (noteName: string, x: number, y: number) => void
  canChangeOrder: boolean
  onChangeOrder: (newOrder: string[]) => void
}

const SidebarNotes = ({
  notes: sidebarNotes, active, onActivateNote, onNoteContextMenu, canChangeOrder, onChangeOrder,
}: SidebarNotesProps): h.JSX.Element => {
  const [notes, setNotes] = useState<SidebarNote[]>(sidebarNotes);

  const [draggedNote, setDraggedNote] = useState<SidebarNote | null>(null);
  const [dragOverNote, setDragOverNote] = useState<string | null>(null);
  const [dragOverNoteConfirmation, setDragOverNoteConfirmation] = useState<string | null>(null);

  const [enteredNote, setEnteredNote] = useState<string | null>(null);
  const enteredNoteRef = useRef<string | null>(null);
  enteredNoteRef.current = enteredNote;

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

  useEffect(() => {
    setDragOverNote(null);
    setDragOverNoteConfirmation(null);
  }, [active]);

  useEffect(() => setNotes(sidebarNotes), [sidebarNotes]);
  useEffect(openEnteredNote, [enteredNote]);

  useEffect(() => {
    const onControlHandle = () => {
      document.body.classList.add("with-control");
      openEnteredNote();
    };

    keyboardShortcuts.subscribe(KeyboardShortcut.OnControl, onControlHandle);
    return () => keyboardShortcuts.unsubscribe(onControlHandle);
  }, []);

  return (
    <Fragment>
      <div
        id="sidebar-notes"
        className={clsx("notes", draggedNote && "dragging")}
      >
        {notes.map((note, index) =>
          <div
            draggable
            class={clsx(
              "note",
              note.name === active && "active",
              note.name === dragOverNote && "drag-over",
              note.name === dragOverNoteConfirmation && "drag-confirmation",
              note === draggedNote && "dragging",
            )}
            onClick={() => onActivateNote(note.name)}
            onMouseEnter={() => !draggedNote && setEnteredNote(note.name)}
            onMouseLeave={() => !draggedNote && setEnteredNote(null)}
            onContextMenu={(event) => {
              event.preventDefault();
              onActivateNote(note.name);
              onNoteContextMenu(note.name, event.pageX, event.pageY);
            }}
            onDragStart={(event) => {
              if (!canChangeOrder) {
                event.preventDefault();
                return;
              }

              if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = "move";
              }
            }}
            onDrag={() => {
              if (draggedNote) {
                return;
              }

              setDraggedNote(note);
            }}
            onDragEnter={() => {
              if (!draggedNote) {
                return;
              }

              setNotes((prev) => {
                const newNotes = [...prev];
                const draggedNoteIndex = newNotes.indexOf(draggedNote);
                newNotes[index] = draggedNote;
                newNotes[draggedNoteIndex] = note;

                return newNotes;
              });
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (note.locked || draggedNote) {
                return;
              }

              setDragOverNote(note.name);
              setDragOverNoteConfirmation(null);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              if (note.locked || draggedNote) {
                return;
              }
              setDragOverNote(null);
            }}
            onDrop={(event) => {
              if (note.locked) {
                return;
              }

              event.preventDefault();
              const data = event.dataTransfer?.getData("text");
              if (data) {
                sendMessage(MessageType.DROP, {
                  targetNoteName: note.name,
                  data,
                });
                setDragOverNoteConfirmation(note.name);
              }

              setDragOverNote(null);
            }}
            onDragEnd={() => {
              setDraggedNote(null);

              const newOrder = notes.map((sidebarNote) => sidebarNote.name);
              onChangeOrder(newOrder);
            }}
          >
            {note.name}
            {note.locked && <SVG text={LockSvgText} />}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default SidebarNotes;
