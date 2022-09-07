import { h } from "preact";
import { SidebarNote } from "notes/adapters";

interface OverviewProps {
  notes: SidebarNote[]
}

const Overview = ({ notes }: OverviewProps): h.JSX.Element => (
  <div id="notes-overview">
    {notes.map((note) => (
      <div className="note-tile">
        <div className="note-tile-title">
          <a href={`notes.html?note=${note.name}`}>{note.name}</a>
        </div>
        <div
          className="note-tile-content"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>
    ))}
  </div>
);

export default Overview;
