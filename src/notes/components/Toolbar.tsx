import { h, Fragment } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { useCallback, useEffect, useState } from "preact/hooks";
import clsx from "clsx";
import commands from "../toolbar/commands";
import InsertImageModal, { InsertImageModalProps } from "./modals/InsertImageModal";
import InsertLinkModal, { InsertLinkModalProps } from "./modals/InsertLinkModal";
import range from "../range";
import Tooltip from "./Tooltip";
import { Note, Theme } from "shared/storage/schema";
import NoteInfo from "./NoteInfo";
import { capitalize } from "shared/string/capitalize-string";
import { HIGHLIGHT_COLORS } from "notes/toolbar/highlight";

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

type Title = "B" | "I" | "U" | "S" | "RF" | "UL" | "OL";

const titles = {
  "B": {
    mac: "Bold (⌘ + B)",
    other: "Bold (Ctrl + B)"
  },
  "I": {
    mac: "Italic (⌘ + I)",
    other: "Italic (Ctrl + I)"
  },
  "U": {
    mac: "Underline (⌘ + U)",
    other: "Underline (Ctrl + U)"
  },
  "S": {
    mac: "Strikethrough (⌘ + Shift + X)",
    other: "Strikethrough (Alt + Shift + 5)"
  },
  "RF": {
    mac: "Remove Format (⌘ + \\)",
    other: "Remove Format (Ctrl + \\)"
  },
  "UL": {
    mac: "Bulleted List (⌘ + Shift + 7)",
    other: "Bulleted List (Ctrl + Shift + 7)"
  },
  "OL": {
    mac: "Numbered List (⌘ + Shift + 8)",
    other: "Numbered List (Ctrl + Shift + 8)"
  }
} as { [key in Title]: { mac: string, other: string } };

interface ToolbarProps {
  os?: "mac" | "other"
  note?: Note
  theme?: Theme
}

const Toolbar = ({ os, note }: ToolbarProps): h.JSX.Element => {
  const getTitle = useCallback((key: Title) => {
    const title = (os && titles[key] && titles[key][os]) || "";
    return title;
  }, [os]);

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
      <div id="toolbar" class="bar">
        <Tooltip tooltip={getTitle("B")}>
          <div id="B" class="button" onClick={commands.bold}>
            <SVG text={BoldSvgText} />
          </div>
        </Tooltip>

        <Tooltip tooltip={getTitle("I")}>
          <div id="I" class="button" onClick={commands.italic}>
            <SVG text={ItalicSvgText} />
          </div>
        </Tooltip>

        <Tooltip tooltip={getTitle("U")}>
          <div id="U" class="button" onClick={commands.underline}>
            <SVG text={UnderlineSvgText} />
          </div>
        </Tooltip>

        <Tooltip tooltip={getTitle("S")}>
          <div id="S" class="button wide" onClick={commands.strikeThrough}>
            <SVG text={StrikethroughSvgText} />
          </div>
        </Tooltip>

        <Tooltip tooltip="Heading">
          <div id="H" class={clsx("button", submenu === "H" && "active")} onClick={toggleSubmenu}>
            <SVG text={TextSvgText} />
            <div class="menu bar" style={{ paddingLeft: ".33em" }}>
              <Tooltip tooltip="Heading 1">
                <div id="H1" class="button auto" onClick={commands.h1}>H<span>1</span></div>
              </Tooltip>
              <Tooltip tooltip="Heading 2">
                <div id="H2" class="button auto" onClick={commands.h2}>H<span>2</span></div>
              </Tooltip>
              <Tooltip tooltip="Heading 3">
                <div id="H3" class="button auto" onClick={commands.h3}>H<span>3</span></div>
              </Tooltip>
            </div>
          </div>
        </Tooltip>

        <Tooltip tooltip={getTitle("UL")}>
          <div id="UL" class="button" onClick={commands.ul}>
            <SVG text={BulletedListSvgText} />
          </div>
        </Tooltip>

        <Tooltip tooltip={getTitle("OL")}>
          <div id="OL" class="button" onClick={commands.ol}>
            <SVG text={NumberedListSvgText} />
          </div>
        </Tooltip>

        <Tooltip tooltip="Outdent">
          <div id="OUTDENT" class="button" onClick={commands.outdent}>
            <SVG text={OutdentSvgText} />
          </div>
        </Tooltip>

        <Tooltip tooltip="Indent">
          <div id="INDENT" class="button" onClick={commands.indent}>
            <SVG text={IndentSvgText} />
          </div>
        </Tooltip>

        <Tooltip tooltip="Align Left">
          <div id="CL" class="button" onClick={commands.left}>
            <SVG text={AlignLeftSvgText} />
          </div>
        </Tooltip>

        <Tooltip tooltip="Align Center">
          <div id="CC" class="button" onClick={commands.center}>
            <SVG text={AlignCenterSvgText} />
          </div>
        </Tooltip>

        <Tooltip tooltip="Align Right">
          <div id="CR" class="button" onClick={commands.right}>
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
                  commands.insertImage(src);
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
                  commands.insertLink(href);
                });
              }
            });
          }}>
            <SVG text={LinkSvgText} />
          </div>
        </Tooltip>

        <Tooltip tooltip="Code Block">
          <div id="PRE" class="button" onClick={commands.pre}>
            <SVG text={CodeSvgText} />
          </div>
        </Tooltip>

        <Tooltip tooltip="Date and Time">
          <div id="DT" class={clsx("button", submenu === "DT" && "active")} onClick={toggleSubmenu}>
            <SVG text={ClockSvgText} />
            <div class="menu bar" style={{ paddingLeft: ".4em" }}>
              <Tooltip tooltip="Insert current Date">
                <div class="button auto" onClick={commands.insertDate}>D</div>
              </Tooltip>
              <Tooltip tooltip="Insert current Time">
                <div class="button auto" onClick={commands.insertTime}>T</div>
              </Tooltip>
              <Tooltip tooltip="Insert current Date and Time">
                <div class="button auto" onClick={commands.insertDateAndTime}>D+T</div>
              </Tooltip>
            </div>
          </div>
        </Tooltip>

        <Tooltip tooltip="Table">
          <div id="TABLE" class={clsx("button", submenu === "TABLE" && "active")} onClick={toggleSubmenu}>
            <SVG text={TableSvgText} />
            <div class="menu bar" style={{ paddingLeft: ".33em" }}>
              <Tooltip tooltip="Insert table (3x3)">
                <div id="TABLE_INSERT" class="button wide" onClick={() => commands.table.insertTable(callback)}>
                  <SVG text={TableSvgText} />
                </div>
              </Tooltip>
              <Tooltip tooltip="Insert row above">
                <div id="TABLE_ROW_ABOVE" class="button" onClick={() => commands.table.insertRowAbove(callback)}>
                  <SVG text={TableRowAboveSvgText} />
                </div>
              </Tooltip>
              <Tooltip tooltip="Insert row below">
                <div id="TABLE_ROW_BELOW" class="button" onClick={() => commands.table.insertRowBelow(callback)}>
                  <SVG text={TableRowBelowSvgText} />
                </div>
              </Tooltip>
              <Tooltip tooltip="Insert column left">
                <div id="TABLE_COLUMN_LEFT" class="button" onClick={() => commands.table.insertColumnLeft(callback)}>
                  <SVG text={TableColumnLeftSvgText} />
                </div>
              </Tooltip>
              <Tooltip tooltip="Insert column right">
                <div id="TABLE_COLUMN_RIGHT" class="button wide" onClick={() => commands.table.insertColumnRight(callback)}>
                  <SVG text={TableColumnRightSvgText} />
                </div>
              </Tooltip>
              <Tooltip tooltip="Toggle heading row">
                <div id="TABLE_HEADING_ROW" class="button" onClick={() => commands.table.toggleHeadingRow(callback)}>
                  <SVG text={TableLineSvgText} />
                </div>
              </Tooltip>
              <Tooltip tooltip="Toggle heading column">
                <div id="TABLE_HEADING_COLUMN" class="button wide rotate90" onClick={() => commands.table.toggleHeadingColumn(callback)}>
                  <SVG text={TableLineSvgText} />
                </div>
              </Tooltip>
              <Tooltip tooltip="Delete row">
                <div id="TABLE_DELETE_ROW" class="button" onClick={() => commands.table.deleteRow(callback)}>
                  <SVG text={TableDeleteRowSvgText} />
                </div>
              </Tooltip>
              <Tooltip tooltip="Delete column">
                <div id="TABLE_DELETE_COLUMN" class="button" onClick={() => commands.table.deleteColumn(callback)}>
                  <SVG text={TableDeleteColumnSvgText} />
                </div>
              </Tooltip>
            </div>
          </div>
        </Tooltip>

        <Tooltip tooltip="Text Color">
          <div id="TC" class={clsx("button", submenu === "TC" && "active")} onClick={toggleSubmenu}>
            <SVG text={TextColorSvgText} />
            <div class="menu bar" style={{ paddingLeft: ".3em" }}>
              {HIGHLIGHT_COLORS.map((color) => (
                <Tooltip tooltip={`Change selected text color to ${capitalize(color)}`}>
                  <div class={`plain button letter my-notes-text-color-${color}`} onClick={() => commands.highlight(`my-notes-text-color-${color}`, callback)}>A</div>
                </Tooltip>
              ))}
              <Tooltip tooltip="Change selected text color to default text color">
                <div class="plain button letter my-notes-text-color-auto" onClick={() => commands.highlight("my-notes-text-color-auto", callback)}>Auto</div>
              </Tooltip>
              <Tooltip tooltip="Highlight selected text">
                <div class="last plain button auto letter my-notes-highlight" onClick={() => commands.highlight("my-notes-highlight", callback)}>Hi</div>
              </Tooltip>
            </div>
          </div>
        </Tooltip>

        <Tooltip tooltip={getTitle("RF")}>
          <div id="RF" class="button" onClick={commands.removeFormat}>
            <SVG text={RemoveFormatSvgText} />
          </div>
        </Tooltip>

        <Tooltip id="info-tooltip" className="info-tooltip" tooltip={note ? <NoteInfo note={note} /> : ""}>
          <div id="INFO" class="button last">
            <SVG text={InfoSvgText} />
          </div>
        </Tooltip>
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
