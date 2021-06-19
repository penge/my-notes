import { h } from "preact";
import { Note } from "shared/storage/schema";
import parseDate from "shared/date/parse-date";
import formatNumber from "shared/number/format-number";

interface NoteInfoProps {
  note: Note
}

const NoteInfo = ({ note }: NoteInfoProps): h.JSX.Element => {
  const created = parseDate(note.createdTime);
  const modified = parseDate(note.modifiedTime);
  const synced = note.sync && parseDate(note.sync.file.modifiedTime);

  const text = note.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = text.length ? text.split(" ").length : 0;
  const charactersCount = text.length;
  const charactersExcludingSpacesCount = text.replace(/\s+/g, "").length;

  return (
    <div className="row">

      <div className="column">
        <div>Created</div>
        <div>Modified</div>
        {synced && <div>Synced</div>}

        <div>&nbsp;</div>
        <div>Words</div>
        <div>Characters</div>
        <div>Characters excluding spaces</div>
      </div>

      <div className="column">
        <div className="row">
          <div className="column">
            <span className="year">{created?.year}</span>
            <span className="year">{modified?.year}</span>
            {synced && <span className="year">{synced.year}</span>}
          </div>

          <div className="column">
            <span className="month-and-day">{`${created?.month} ${created?.day}`}</span>
            <span className="month-and-day">{`${modified?.month} ${modified?.day}`}</span>
            {synced && <span className="month-and-day">{`${synced?.month} ${synced?.day}`}</span>}
          </div>

          <div className="column">
            <span className="time">{created?.time}</span>
            <span className="time">{modified?.time}</span>
            {synced && <span className="time">{synced?.time}</span>}
          </div>
        </div>

        <div>&nbsp;</div>
        <div>{formatNumber(wordCount)}</div>
        <div>{formatNumber(charactersCount)}</div>
        <div>{formatNumber(charactersExcludingSpacesCount)}</div>
      </div>
    </div>
  );
};

export default NoteInfo;
