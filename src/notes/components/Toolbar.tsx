import { h, Fragment } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import clsx from "clsx";
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
import { Os, Note } from "shared/storage/schema";
import NoteInfo from "./NoteInfo";
import { capitalize } from "shared/string/capitalize-string";
import { HIGHLIGHT_COLORS } from "notes/commands/highlight";

import BoldSvgText from "svg/bold.svg";
import ItalicSvgText from "svg/italic.svg";
import UnderlineSvgText from "svg/underline.svg";
import StrikethroughSvgText from "svg/strikethrough.svg";
import TextSvgText from "svg/text.svg";
import BulletedListSvgText from "svg/bulleted-list.svg";
import NumberedListSvgText from "svg/numbered-list.svg";
import OutdentSvgText from "svg/outdent.svg";
import IndentSvgText from "svg/indent.svg";
import AlignLeftSvgText from "svg/align-left.svg";
import AlignCenterSvgText from "svg/align-center.svg";
import AlignRightSvgText from "svg/align-right.svg";
import HorizontalRuleSvgText from "svg/horizontal-rule.svg";
import ImageSvgText from "svg/image.svg";
import LinkSvgText from "svg/link.svg";
import EmbedHtmlSvgText from "svg/embed.svg";
import CodeSvgText from "svg/code.svg";
import ClockSvgText from "svg/clock.svg";
import TableSvgText from "svg/table.svg";
import TableRowAboveSvgText from "svg/table-row-above.svg";
import TableRowBelowSvgText from "svg/table-row-below.svg";
import TableColumnLeftSvgText from "svg/table-column-left.svg";
import TableColumnRightSvgText from "svg/table-column-right.svg";
import TableLineSvgText from "svg/table-line.svg";
import TableDeleteRowSvgText from "svg/table-delete-row.svg";
import TableDeleteColumnSvgText from "svg/table-delete-column.svg";
import TextColorSvgText from "svg/text-color.svg";
import RemoveFormatSvgText from "svg/remove-format.svg";
import InfoSvgText from "svg/info.svg";
import SVG from "types/SVG";
import { reinitTables } from "notes/content/table";
import EmbedHtmlModal, { EmbedHtmlModalProps } from "./modals/EmbedHtmlModal";

import { t } from "i18n";

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
}

const Toolbar = ({ os, note }: ToolbarProps): h.JSX.Element => {
  const [submenu, setSubmenu] = useState<string | null>(null);

  const toggleSubmenu = useCallback((event: MouseEvent): void => {
    if (event.target === event.currentTarget) {
      range.save();
      const submenuToToggle = (event.target as HTMLDivElement).id;
      setSubmenu((prev) => prev === submenuToToggle ? null : submenuToToggle);
    }
  }, []);

  useEffect(() => {
    range.restore();
  }, [submenu]);

  const [insertImageModalProps, setInsertImageModalProps] = useState<InsertImageModalProps | null>(null);
  const [insertLinkModalProps, setInsertLinkModalProps] = useState<InsertLinkModalProps | null>(null);
  const [embedHtmlModalProps, setEmbedHtmlModalProps] = useState<EmbedHtmlModalProps | null>(null);

  return (
    <Fragment>
      <div id="toolbar" class={clsx(note.locked && "locked")}>
        {submenu === "H" && (
          <div class="submenu bar" style={{ paddingLeft: ".33em" }}>
            <Tooltip tooltip={t("Heading 1")}>
              <div id="H1" class="button auto" onClick={commands.H1}>H<span>1</span></div>
            </Tooltip>
            <Tooltip tooltip={t("Heading 2")}>
              <div id="H2" class="button auto" onClick={commands.H2}>H<span>2</span></div>
            </Tooltip>
            <Tooltip tooltip={t("Heading 3")}>
              <div id="H3" class="button auto" onClick={commands.H3}>H<span>3</span></div>
            </Tooltip>
          </div>
        )}

        {submenu === "DT" && (
          <div class="submenu bar" style={{ paddingLeft: ".4em" }}>
            <Tooltip tooltip={t("Insert current Date")}>
              <div class="button auto" onClick={commands.InsertCurrentDate}>D</div>
            </Tooltip>
            <Tooltip tooltip={t("Insert current Time")}>
              <div class="button auto" onClick={commands.InsertCurrentTime}>T</div>
            </Tooltip>
            <Tooltip tooltip={t("Insert current Date and Time")}>
              <div class="button auto" onClick={commands.InsertCurrentDateAndTime}>D+T</div>
            </Tooltip>
          </div>
        )}

        {submenu === "TABLE" && (
          <div class="submenu bar" style={{ paddingLeft: ".33em" }}>
            <Tooltip tooltip={t("Insert table (3x3)")}>
              <div id="TABLE_INSERT" class="button wide" onClick={() => table.insertTable(tableCallback)}>
                <SVG text={TableSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Insert row above")}>
              <div id="TABLE_ROW_ABOVE" class="button" onClick={() => table.insertRowAbove(tableCallback)}>
                <SVG text={TableRowAboveSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Insert row below")}>
              <div id="TABLE_ROW_BELOW" class="button" onClick={() => table.insertRowBelow(tableCallback)}>
                <SVG text={TableRowBelowSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Insert column left")}>
              <div id="TABLE_COLUMN_LEFT" class="button" onClick={() => table.insertColumnLeft(tableCallback)}>
                <SVG text={TableColumnLeftSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Insert column right")}>
              <div id="TABLE_COLUMN_RIGHT" class="button wide" onClick={() => table.insertColumnRight(tableCallback)}>
                <SVG text={TableColumnRightSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Toggle heading row")}>
              <div id="TABLE_HEADING_ROW" class="button" onClick={() => table.toggleHeadingRow(callback)}>
                <SVG text={TableLineSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Toggle heading column")}>
              <div id="TABLE_HEADING_COLUMN" class="button wide rotate90" onClick={() => table.toggleHeadingColumn(callback)}>
                <SVG text={TableLineSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Delete row")}>
              <div id="TABLE_DELETE_ROW" class="button" onClick={() => table.deleteRow(tableCallback)}>
                <SVG text={TableDeleteRowSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip={t("Delete column")}>
              <div id="TABLE_DELETE_COLUMN" class="button" onClick={() => table.deleteColumn(tableCallback)}>
                <SVG text={TableDeleteColumnSvgText} />
              </div>
            </Tooltip>
          </div>
        )}

        {submenu === "TC" && (
          <div class="submenu bar">
            {HIGHLIGHT_COLORS.map((color) => (
              <Tooltip tooltip={t("Change selected text color to", { color: capitalize(color)})}>
                <div class={`plain button letter my-notes-text-color-${color}`} onClick={() => highlight(`my-notes-text-color-${color}`, callback)}>A</div>
              </Tooltip>
            ))}
            <Tooltip tooltip={t("Change selected text color to default text color")}>
              <div class="plain button letter my-notes-text-color-auto" onClick={() => highlight("my-notes-text-color-auto", callback)}>Auto</div>
            </Tooltip>
            <Tooltip tooltip={t("Highlight selected text")}>
              <div class="last plain button auto letter my-notes-highlight" onClick={() => highlight("my-notes-highlight", callback)}>Hi</div>
            </Tooltip>
          </div>
        )}

        <div class="topmenu bar">
          <Tooltip tooltip={t(`Bold.${os}`)}>
            <div id="B" class="button" onClick={commands.Bold}>
              <SVG text={BoldSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t(`Italic.${os}`)}>
            <div id="I" class="button" onClick={commands.Italic}>
              <SVG text={ItalicSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t(`Underline.${os}`)}>
            <div id="U" class="button" onClick={commands.Underline}>
              <SVG text={UnderlineSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t(`StrikeThrough.${os}`)}>
            <div id="S" class="button wide" onClick={commands.StrikeThrough}>
              <SVG text={StrikethroughSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Heading")}>
            <div id="H" class={clsx("button", submenu === "H" && "active")} onClick={toggleSubmenu}>
              <SVG text={TextSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t(`UL.${os}`)}>
            <div id="UL" class="button" onClick={commands.UL}>
              <SVG text={BulletedListSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t(`OL.${os}`)}>
            <div id="OL" class="button" onClick={commands.OL}>
              <SVG text={NumberedListSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Outdent")}>
            <div id="OUTDENT" class="button" onClick={commands.Outdent}>
              <SVG text={OutdentSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Indent")}>
            <div id="INDENT" class="button" onClick={commands.Indent}>
              <SVG text={IndentSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Align Left")}>
            <div id="CL" class="button" onClick={commands.AlignLeft}>
              <SVG text={AlignLeftSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Align Center")}>
            <div id="CC" class="button" onClick={commands.AlignCenter}>
              <SVG text={AlignCenterSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Align Right")}>
            <div id="CR" class="button" onClick={commands.AlignRight}>
              <SVG text={AlignRightSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Insert Horizontal Rule")}>
            <div id="HR" class="button" onClick={commands.InsertHorizontalRule}>
              <SVG text={HorizontalRuleSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Insert Image")}>
            <div id="IMG" class="button" onClick={() => {
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
                }
              });
            }}>
              <SVG text={ImageSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Insert Link")}>
            <div id="LINK" class="button" onClick={() => {
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
                }
              });
            }}>
              <SVG text={LinkSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Embed HTML")}>
            <div id="EMBED-HTML" class="button" onClick={() => {
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
                }
              });
            }}>
              <SVG text={EmbedHtmlSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Code")}>
            <div id="PRE" class="button" onClick={commands.Pre}>
              <SVG text={CodeSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Date and Time")}>
            <div id="DT" class={clsx("button", submenu === "DT" && "active")} onClick={toggleSubmenu}>
              <SVG text={ClockSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Table")}>
            <div id="TABLE" class={clsx("button", submenu === "TABLE" && "active")} onClick={toggleSubmenu}>
              <SVG text={TableSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t("Text Color")}>
            <div id="TC" class={clsx("button", submenu === "TC" && "active")} onClick={toggleSubmenu}>
              <SVG text={TextColorSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={t(`Remove Formatting.${os}`)}>
            <div id="RF" class="button" onClick={commands.RemoveFormat}>
              <SVG text={RemoveFormatSvgText} />
            </div>
          </Tooltip>

          <Tooltip id="info-tooltip" className="info-tooltip" tooltip={note ? <NoteInfo note={note} /> : ""}>
            <div id="INFO" class="button last">
              <SVG text={InfoSvgText} />
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
