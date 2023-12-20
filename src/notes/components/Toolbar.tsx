/* eslint-disable react/jsx-props-no-spreading */
import { h, Fragment } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import clsx from "clsx";
import { Os, Note } from "shared/storage/schema";
import { t } from "i18n";
import capitalize from "shared/string/capitalize";
import { HIGHLIGHT_COLORS } from "notes/commands/highlight";
import { reinitTables } from "notes/content/table";
import SVG from "notes/components/SVG";
import svgs from "svg";
import {
  commands,
  InsertImageFactory,
  InsertLinkFactory,
  EmbedHtmlFactory,
  table,
  highlight,
} from "../commands";
import InsertImageModal, { InsertImageModalProps } from "./modals/InsertImageModal";
import InsertLinkModal, { InsertLinkModalProps } from "./modals/InsertLinkModal";
import range from "../range";
import Tooltip from "./Tooltip";
import NoteInfo from "./NoteInfo";
import EmbedHtmlModal, { EmbedHtmlModalProps } from "./modals/EmbedHtmlModal";

const callback = () => {
  const event = new Event("editnote");
  document.dispatchEvent(event);
};

const tableCallback = () => {
  callback();
  reinitTables({
    onResize: callback,
  });
};

interface ToolbarProps {
  os: Os
  note: Note
  raw: boolean
  onToggleRaw: () => void
}

const Toolbar = ({
  os, note, raw, onToggleRaw,
}: ToolbarProps): h.JSX.Element => {
  const [submenu, setSubmenu] = useState<string | null>(null);

  const toggleSubmenu = useCallback((event: MouseEvent): void => {
    if (event.target === event.currentTarget) {
      range.save();
      const submenuToToggle = (event.target as HTMLDivElement).id;
      setSubmenu((prev) => (prev === submenuToToggle ? null : submenuToToggle));
    }
  }, []);

  useEffect(() => {
    range.restore();
  }, [submenu]);

  const [insertImageModalProps, setInsertImageModalProps] = useState<InsertImageModalProps | null>(null);
  const [insertLinkModalProps, setInsertLinkModalProps] = useState<InsertLinkModalProps | null>(null);
  const [embedHtmlModalProps, setEmbedHtmlModalProps] = useState<EmbedHtmlModalProps | null>(null);

  if (raw) {
    return (
      <div id="toolbar" className={clsx(note.locked && "locked")}>
        <div className="topmenu bar">
          <Tooltip tooltip={t("Toggle RAW")}>
            <div id="RAW-ACTIVE" className="button last" onClick={onToggleRaw}>RAW</div>
          </Tooltip>

          <Tooltip id="info-tooltip" className="info-tooltip" tooltip={note ? <NoteInfo note={note} /> : ""}>
            <div id="INFO" className="button">
              <SVG text={svgs.InfoSvgText} />
            </div>
          </Tooltip>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div id="toolbar" className={clsx(note.locked && "locked")}>
        {submenu === "H" && (
          <div className="submenu bar" style={{ paddingLeft: ".33em" }}>
            <Tooltip tooltip={t("Heading 1")}>
              <div id="H1" className="button auto" onClick={commands.H1}>
                H
                <span>1</span>
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Heading 2")}>
              <div id="H2" className="button auto" onClick={commands.H2}>
                H
                <span>2</span>
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Heading 3")}>
              <div id="H3" className="button auto" onClick={commands.H3}>
                H
                <span>3</span>
              </div>
            </Tooltip>
          </div>
        )}

        {submenu === "DT" && (
          <div className="submenu bar" style={{ paddingLeft: ".4em" }}>
            <Tooltip tooltip={t("Insert current Date")}>
              <div className="button auto" onClick={commands.InsertCurrentDate}>D</div>
            </Tooltip>
            <Tooltip tooltip={t("Insert current Time")}>
              <div className="button auto" onClick={commands.InsertCurrentTime}>T</div>
            </Tooltip>
            <Tooltip tooltip={t("Insert current Date and Time")}>
              <div className="button auto" onClick={commands.InsertCurrentDateAndTime}>D+T</div>
            </Tooltip>
          </div>
        )}

        {submenu === "TABLE" && (
          <div className="submenu bar" style={{ paddingLeft: ".33em" }}>
            <Tooltip tooltip={t("Insert table (3x3)")}>
              <div id="TABLE_INSERT" className="button wide" onClick={() => table.insertTable(tableCallback)}>
                <SVG text={svgs.TableSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Insert row above")}>
              <div id="TABLE_ROW_ABOVE" className="button" onClick={() => table.insertRowAbove(tableCallback)}>
                <SVG text={svgs.TableRowAboveSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Insert row below")}>
              <div id="TABLE_ROW_BELOW" className="button" onClick={() => table.insertRowBelow(tableCallback)}>
                <SVG text={svgs.TableRowBelowSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Insert column left")}>
              <div id="TABLE_COLUMN_LEFT" className="button" onClick={() => table.insertColumnLeft(tableCallback)}>
                <SVG text={svgs.TableColumnLeftSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Insert column right")}>
              <div id="TABLE_COLUMN_RIGHT" className="button wide" onClick={() => table.insertColumnRight(tableCallback)}>
                <SVG text={svgs.TableColumnRightSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Toggle heading row")}>
              <div id="TABLE_HEADING_ROW" className="button" onClick={() => table.toggleHeadingRow(callback)}>
                <SVG text={svgs.TableLineSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Toggle heading column")}>
              <div id="TABLE_HEADING_COLUMN" className="button wide rotate90" onClick={() => table.toggleHeadingColumn(callback)}>
                <SVG text={svgs.TableLineSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Delete row")}>
              <div id="TABLE_DELETE_ROW" className="button" onClick={() => table.deleteRow(tableCallback)}>
                <SVG text={svgs.TableDeleteRowSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Delete column")}>
              <div id="TABLE_DELETE_COLUMN" className="button" onClick={() => table.deleteColumn(tableCallback)}>
                <SVG text={svgs.TableDeleteColumnSvgText} />
              </div>
            </Tooltip>
          </div>
        )}

        {submenu === "TC" && (
          <div className="submenu bar">
            {HIGHLIGHT_COLORS.map((color) => (
              <Tooltip tooltip={t("Change selected text color to", { color: capitalize(color) })}>
                <div
                  className={`plain letter button my-notes-text-color-${color}`}
                  onClick={() => highlight(`my-notes-text-color-${color}`, callback)}
                >
                  A
                </div>
              </Tooltip>
            ))}
            <Tooltip tooltip={t("Change selected text color to default text color")}>
              <div
                className="plain auto letter button my-notes-text-color-auto"
                onClick={() => highlight("my-notes-text-color-auto", callback)}
              >
                Auto
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Highlight selected text")}>
              <div
                className="last plain auto letter button my-notes-highlight"
                onClick={() => highlight("my-notes-highlight", callback)}
              >
                Hi
              </div>
            </Tooltip>
          </div>
        )}

        <div className="topmenu bar">
          <Tooltip tooltip={t(`Bold.${os}`)}>
            <div id="B" className="button" onClick={commands.Bold}>
              <SVG text={svgs.BoldSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t(`Italic.${os}`)}>
            <div id="I" className="button" onClick={commands.Italic}>
              <SVG text={svgs.ItalicSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t(`Underline.${os}`)}>
            <div id="U" className="button" onClick={commands.Underline}>
              <SVG text={svgs.UnderlineSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t(`StrikeThrough.${os}`)}>
            <div id="S" className="button wide" onClick={commands.StrikeThrough}>
              <SVG text={svgs.StrikethroughSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Heading")}>
            <div id="H" className={clsx("button", submenu === "H" && "active")} onClick={toggleSubmenu}>
              <SVG text={svgs.TextSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t(`UL.${os}`)}>
            <div id="UL" className="button" onClick={commands.UL}>
              <SVG text={svgs.BulletedListSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t(`OL.${os}`)}>
            <div id="OL" className="button" onClick={commands.OL}>
              <SVG text={svgs.NumberedListSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Outdent")}>
            <div id="OUTDENT" className="button" onClick={commands.Outdent}>
              <SVG text={svgs.OutdentSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Indent")}>
            <div id="INDENT" className="button" onClick={commands.Indent}>
              <SVG text={svgs.IndentSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Align Left")}>
            <div id="CL" className="button" onClick={commands.AlignLeft}>
              <SVG text={svgs.AlignLeftSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Align Center")}>
            <div id="CC" className="button" onClick={commands.AlignCenter}>
              <SVG text={svgs.AlignCenterSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Align Right")}>
            <div id="CR" className="button" onClick={commands.AlignRight}>
              <SVG text={svgs.AlignRightSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Insert Horizontal Rule")}>
            <div id="HR" className="button" onClick={commands.InsertHorizontalRule}>
              <SVG text={svgs.HorizontalRuleSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Insert Image")}>
            <div
              id="IMG"
              className="button"
              onClick={() => {
                range.save();
                setInsertImageModalProps({
                  onCancel: () => {
                    setInsertImageModalProps(null);
                    range.restore();
                  },
                  onConfirm: (src) => {
                    setInsertImageModalProps(null);
                    range.restore(() => {
                      InsertImageFactory({ src })();
                    });
                  },
                });
              }}
            >
              <SVG text={svgs.ImageSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Insert Link")}>
            <div
              id="LINK"
              className="button"
              onClick={() => {
                range.save();
                setInsertLinkModalProps({
                  onCancel: () => {
                    setInsertLinkModalProps(null);
                    range.restore();
                  },
                  onConfirm: (href) => {
                    setInsertLinkModalProps(null);
                    range.restore(() => {
                      InsertLinkFactory({ href })();
                    });
                  },
                });
              }}
            >
              <SVG text={svgs.LinkSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Embed HTML")}>
            <div
              id="EMBED-HTML"
              className="button"
              onClick={() => {
                range.save();
                setEmbedHtmlModalProps({
                  onCancel: () => {
                    setEmbedHtmlModalProps(null);
                    range.restore();
                  },
                  onConfirm: (html) => {
                    setEmbedHtmlModalProps(null);
                    range.restore(() => {
                      EmbedHtmlFactory({ html })();
                    });
                  },
                });
              }}
            >
              <SVG text={svgs.EmbedHtmlSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Code")}>
            <div id="PRE" className="button" onClick={commands.Pre}>
              <SVG text={svgs.CodeSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Date and Time")}>
            <div id="DT" className={clsx("button", submenu === "DT" && "active")} onClick={toggleSubmenu}>
              <SVG text={svgs.ClockSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Table")}>
            <div id="TABLE" className={clsx("button", submenu === "TABLE" && "active")} onClick={toggleSubmenu}>
              <SVG text={svgs.TableSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Text Color")}>
            <div id="TC" className={clsx("button", submenu === "TC" && "active")} onClick={toggleSubmenu}>
              <SVG text={svgs.TextColorSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t(`Remove Formatting.${os}`)}>
            <div id="RF" className="button" onClick={commands.RemoveFormat}>
              <SVG text={svgs.RemoveFormatSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Toggle RAW")}>
            <div id="RAW" className="button last" onClick={onToggleRaw}>RAW</div>
          </Tooltip>

          <Tooltip id="info-tooltip" className="info-tooltip" tooltip={note ? <NoteInfo note={note} /> : ""}>
            <div id="INFO" className="button">
              <SVG text={svgs.InfoSvgText} />
            </div>
          </Tooltip>
        </div>
      </div>

      {insertImageModalProps && (
        <InsertImageModal {...insertImageModalProps} />
      )}

      {insertLinkModalProps && (
        <InsertLinkModal {...insertLinkModalProps} />
      )}

      {embedHtmlModalProps && (
        <EmbedHtmlModal {...embedHtmlModalProps} />
      )}
    </Fragment>
  );
};

export default Toolbar;
