import { h, RefObject, Fragment } from "preact";
import { useRef, useCallback, useState } from "preact/hooks";
import clsx from "clsx";
import preventEnter from "shared/components/prevent-enter";
import { exportNotes } from "notes/export";
import {
  ACCEPTED_TEXT_TYPES, importNotesFromTextFiles,
  ACCEPTED_ZIP_TYPE, importNotesFromZipFile,
} from "notes/import";
import { t, tString } from "i18n";

const alertImported = (importedNoteNames: string[]) => {
  if (!importedNoteNames.length) {
    alert(tString("No notes were imported"));
    return;
  }

  const summary = importedNoteNames.length === 1
    ? tString("Imported.one")
    : tString("Imported.other", { count: importedNoteNames.length });

  const notes = importedNoteNames.map((noteName) => `- ${noteName}`).join("\r\n");

  alert(`${summary}\r\n${notes}`);
};

interface ExportImportProps {
  canExport: boolean
}

const ExportImport = ({ canExport }: ExportImportProps): h.JSX.Element => {
  const [lockedExport, setLockedExport] = useState<boolean>(false);
  const textRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);

  const handleImport = useCallback((ref: RefObject<HTMLInputElement>) => (importedNoteNames: string[]) => {
    // eslint-disable-next-line no-param-reassign
    if (ref.current) { ref.current.value = ""; } // reset input's value so can select and import the same file(s) again
    alertImported(importedNoteNames);
  }, []);

  return (
    <Fragment>
      <h2>{t("Export & Import")}</h2>

      {/* Buttons */}

      <div className="buttons">
        <input
          type="button"
          className={clsx("bold", "button", !canExport && "disabled")}
          value={tString("Export notes")}
          onKeyPress={preventEnter}
          onClick={() => {
            if (!canExport || lockedExport) {
              return;
            }

            setLockedExport(true);
            exportNotes();
            window.setTimeout(() => setLockedExport(false), 1000);
          }}
        />

        <input
          type="button"
          className={clsx("bold", "button")}
          value={tString("Import notes from text files")}
          onKeyPress={preventEnter}
          onClick={() => textRef.current?.click()}
        />

        <input
          type="button"
          className={clsx("bold", "button")}
          value={tString("Import notes from a ZIP file")}
          onKeyPress={preventEnter}
          onClick={() => zipRef.current?.click()}
        />
      </div>

      {/* File Inputs */}

      <input
        type="file"
        style={{ display: "none" }}
        ref={textRef}
        accept={ACCEPTED_TEXT_TYPES.join(",")}
        multiple
        onChange={() => {
          if (!textRef.current || !textRef.current.files) {
            return;
          }

          importNotesFromTextFiles(textRef.current.files).then(handleImport(textRef));
        }}
      />

      <input
        type="file"
        style={{ display: "none" }}
        ref={zipRef}
        accept={ACCEPTED_ZIP_TYPE}
        onChange={() => {
          if (!zipRef.current || !zipRef.current.files || zipRef.current.files.length !== 1) {
            return;
          }

          importNotesFromZipFile(zipRef.current.files[0]).then(handleImport(zipRef));
        }}
      />
    </Fragment>
  );
};

export default ExportImport;
