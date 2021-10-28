import { h } from "preact";
import { useRef } from "preact/hooks";
import { Os, Sync } from "shared/storage/schema";
import { SidebarNote } from "notes/adapters";
import SidebarNotes from "./SidebarNotes";
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
}

const Sidebar = ({
  os, notes, canChangeOrder, onChangeOrder, active, width, onActivateNote, onNoteContextMenu, onNewNote, sync,
}: SidebarProps): h.JSX.Element => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id="sidebar"
      ref={sidebarRef}
      style={{
        width: width,
        minWidth: width,
      }}
    >
      <SidebarNotes
        notes={notes}
        active={active}
        onActivateNote={onActivateNote}
        onNoteContextMenu={onNoteContextMenu}
        canChangeOrder={canChangeOrder}
        onChangeOrder={onChangeOrder}
      />

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
