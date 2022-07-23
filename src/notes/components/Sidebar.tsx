import { h } from "preact";
import { useRef, useState, useMemo } from "preact/hooks";
import { Os, Sync } from "shared/storage/schema";
import { SidebarNote } from "notes/adapters";
import SidebarNotes, { SidebarNotesProps } from "./SidebarNotes";
import SidebarButtons from "./SidebarButtons";
import Drag from "./Drag";

interface SidebarProps {
  os?: Os
  notes: SidebarNote[]
  canChangeOrder: boolean
  onChangeOrder: (newOrder: string[]) => void
  active: string
  width?: string
  onActivateNote: (noteName: string) => void
  onNoteContextMenu: (noteName: string, x: number, y: number) => void
  onNewNote: () => void
  sync?: Sync
  openNoteOnMouseHover: boolean
}

const Sidebar = ({
  os, notes, canChangeOrder, onChangeOrder, active, width, onActivateNote, onNoteContextMenu, onNewNote, sync, openNoteOnMouseHover,
}: SidebarProps): h.JSX.Element => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [onDraggingNoteOriginator, setOnDraggingNoteOriginator] = useState<string | undefined>(undefined);
  const commonSidebarNotesProps: Omit<SidebarNotesProps, "id" | "notes" | "canDragEnter" | "onChangeOrder"> = {
    active,
    onActivateNote,
    onNoteContextMenu,
    canChangeOrder,
    openNoteOnMouseHover,
    setOnDraggingNoteOriginator,
  };

  const pinnedNotes = useMemo(() => notes.filter((note) => note.pinnedTime), [notes]);
  const unpinnedNotes = useMemo(() => notes.filter((note) => !note.pinnedTime), [notes]);

  return (
    <div
      id="sidebar"
      ref={sidebarRef}
      style={{
        width,
        minWidth: width,
      }}
    >
      <div id="sidebar-notes-container">
        {pinnedNotes.length > 0 && (
          <SidebarNotes
            id="sidebar-notes-pinned"
            notes={pinnedNotes}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...commonSidebarNotesProps}
            canDragEnter={onDraggingNoteOriginator === "sidebar-notes-pinned"}
            onChangeOrder={(newOrder) => onChangeOrder([
              ...newOrder,
              ...unpinnedNotes.map((note) => note.name),
            ])}
          />
        )}

        {pinnedNotes.length > 0 && unpinnedNotes.length > 0 && (
          <div id="sidebar-notes-separator" />
        )}

        {unpinnedNotes.length > 0 && (
          <SidebarNotes
            id="sidebar-notes-unpinned"
            notes={unpinnedNotes}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...commonSidebarNotesProps}
            canDragEnter={onDraggingNoteOriginator === "sidebar-notes-unpinned"}
            onChangeOrder={(newOrder) => onChangeOrder([
              ...pinnedNotes.map((note) => note.name),
              ...newOrder,
            ])}
          />
        )}
      </div>

      <SidebarButtons
        os={os}
        sync={sync}
        onNewNote={onNewNote}
      />

      <Drag sidebar={sidebarRef} />
    </div>
  );
};

export default Sidebar;
