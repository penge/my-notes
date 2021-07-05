import { h, Fragment } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import clsx from "clsx";
import {
  commands,
  InsertImageFactory,
  InsertLinkFactory,
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
import ImageSvgText from "svg/image.svg";
import LinkSvgText from "svg/link.svg";
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

const callback = () => {
  const event = new Event("editnote");
  document.dispatchEvent(event);
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

  return (
    <Fragment>
      <div id="toolbar" class={clsx(note.locked && "locked")}>
        {submenu === "H" && (
          <div class="submenu bar" style={{ paddingLeft: ".33em" }}>
            <Tooltip tooltip="Heading 1">
              <div id="H1" class="button auto" onClick={commands.H1.execute}>H<span>1</span></div>
            </Tooltip>
            <Tooltip tooltip="Heading 2">
              <div id="H2" class="button auto" onClick={commands.H2.execute}>H<span>2</span></div>
            </Tooltip>
            <Tooltip tooltip="Heading 3">
              <div id="H3" class="button auto" onClick={commands.H3.execute}>H<span>3</span></div>
            </Tooltip>
          </div>
        )}

        {submenu === "DT" && (
          <div class="submenu bar" style={{ paddingLeft: ".4em" }}>
            <Tooltip tooltip={commands.InsertCurrentDate.name}>
              <div class="button auto" onClick={commands.InsertCurrentDate.execute}>D</div>
            </Tooltip>
            <Tooltip tooltip={commands.InsertCurrentTime.name}>
              <div class="button auto" onClick={commands.InsertCurrentTime.execute}>T</div>
            </Tooltip>
            <Tooltip tooltip={commands.InsertCurrentDateAndTime.name}>
              <div class="button auto" onClick={commands.InsertCurrentDateAndTime.execute}>D+T</div>
            </Tooltip>
          </div>
        )}

        {submenu === "TABLE" && (
          <div class="submenu bar" style={{ paddingLeft: ".33em" }}>
            <Tooltip tooltip="Insert table (3x3)">
              <div id="TABLE_INSERT" class="button wide" onClick={() => table.insertTable(callback)}>
                <SVG text={TableSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip="Insert row above">
              <div id="TABLE_ROW_ABOVE" class="button" onClick={() => table.insertRowAbove(callback)}>
                <SVG text={TableRowAboveSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip="Insert row below">
              <div id="TABLE_ROW_BELOW" class="button" onClick={() => table.insertRowBelow(callback)}>
                <SVG text={TableRowBelowSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip="Insert column left">
              <div id="TABLE_COLUMN_LEFT" class="button" onClick={() => table.insertColumnLeft(callback)}>
                <SVG text={TableColumnLeftSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip="Insert column right">
              <div id="TABLE_COLUMN_RIGHT" class="button wide" onClick={() => table.insertColumnRight(callback)}>
                <SVG text={TableColumnRightSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip="Toggle heading row">
              <div id="TABLE_HEADING_ROW" class="button" onClick={() => table.toggleHeadingRow(callback)}>
                <SVG text={TableLineSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip="Toggle heading column">
              <div id="TABLE_HEADING_COLUMN" class="button wide rotate90" onClick={() => table.toggleHeadingColumn(callback)}>
                <SVG text={TableLineSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip="Delete row">
              <div id="TABLE_DELETE_ROW" class="button" onClick={() => table.deleteRow(callback)}>
                <SVG text={TableDeleteRowSvgText} />
              </div>
            </Tooltip>
            <Tooltip tooltip="Delete column">
              <div id="TABLE_DELETE_COLUMN" class="button" onClick={() => table.deleteColumn(callback)}>
                <SVG text={TableDeleteColumnSvgText} />
              </div>
            </Tooltip>
          </div>
        )}

        {submenu === "TC" && (
          <div class="submenu bar">
            {HIGHLIGHT_COLORS.map((color) => (
              <Tooltip tooltip={`Change selected text color to ${capitalize(color)}`}>
                <div class={`plain button letter my-notes-text-color-${color}`} onClick={() => highlight(`my-notes-text-color-${color}`, callback)}>A</div>
              </Tooltip>
            ))}
            <Tooltip tooltip="Change selected text color to default text color">
              <div class="plain button letter my-notes-text-color-auto" onClick={() => highlight("my-notes-text-color-auto", callback)}>Auto</div>
            </Tooltip>
            <Tooltip tooltip="Highlight selected text">
              <div class="last plain button auto letter my-notes-highlight" onClick={() => highlight("my-notes-highlight", callback)}>Hi</div>
            </Tooltip>
          </div>
        )}

        <div class="topmenu bar">
          <Tooltip tooltip={commands.Bold.title(os)}>
            <div id="B" class="button" onClick={commands.Bold.execute}>
              <SVG text={BoldSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={commands.Italic.title(os)}>
            <div id="I" class="button" onClick={commands.Italic.execute}>
              <SVG text={ItalicSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={commands.Underline.title(os)}>
            <div id="U" class="button" onClick={commands.Underline.execute}>
              <SVG text={UnderlineSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={commands.StrikeThrough.title(os)}>
            <div id="S" class="button wide" onClick={commands.StrikeThrough.execute}>
              <SVG text={StrikethroughSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip="Heading">
            <div id="H" class={clsx("button", submenu === "H" && "active")} onClick={toggleSubmenu}>
              <SVG text={TextSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={commands.UL.title(os)}>
            <div id="UL" class="button" onClick={commands.UL.execute}>
              <SVG text={BulletedListSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={commands.OL.title(os)}>
            <div id="OL" class="button" onClick={commands.OL.execute}>
              <SVG text={NumberedListSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={commands.Outdent.name}>
            <div id="OUTDENT" class="button" onClick={commands.Outdent.execute}>
              <SVG text={OutdentSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={commands.Indent.name}>
            <div id="INDENT" class="button" onClick={commands.Indent.execute}>
              <SVG text={IndentSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={commands.AlignLeft.name}>
            <div id="CL" class="button" onClick={commands.AlignLeft.execute}>
              <SVG text={AlignLeftSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={commands.AlignCenter.name}>
            <div id="CC" class="button" onClick={commands.AlignCenter.execute}>
              <SVG text={AlignCenterSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={commands.AlignRight.name}>
            <div id="CR" class="button" onClick={commands.AlignRight.execute}>
              <SVG text={AlignRightSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip="Insert Image">
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
                    InsertImageFactory({ src }).execute();
                  });
                }
              });
            }}>
              <SVG text={ImageSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip="Insert Link">
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
                    InsertLinkFactory({ href }).execute();
                  });
                }
              });
            }}>
              <SVG text={LinkSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={commands.Pre.name}>
            <div id="PRE" class="button" onClick={commands.Pre.execute}>
              <SVG text={CodeSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip="Date and Time">
            <div id="DT" class={clsx("button", submenu === "DT" && "active")} onClick={toggleSubmenu}>
              <SVG text={ClockSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip="Table">
            <div id="TABLE" class={clsx("button", submenu === "TABLE" && "active")} onClick={toggleSubmenu}>
              <SVG text={TableSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip="Text Color">
            <div id="TC" class={clsx("button", submenu === "TC" && "active")} onClick={toggleSubmenu}>
              <SVG text={TextColorSvgText} />
            </div>
          </Tooltip>

          <Tooltip tooltip={commands.RemoveFormat.title(os)}>
            <div id="RF" class="button" onClick={commands.RemoveFormat.execute}>
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
    </Fragment>
  );
};

export default Toolbar;
