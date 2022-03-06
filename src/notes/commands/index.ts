import dateUtils from "shared/date/date-utils";
import table from "./table";
import highlight from "./highlight";

export type Command = () => void;
type CommandFactory<P> = (props: P) => Command;

const exec = (command: string, value?: string): boolean =>
  document.execCommand(command, false, value);

const Bold: Command = () => { exec("bold"); };
const Italic: Command = () => { exec("italic"); };
const Underline: Command = () => { exec("underline"); };
const StrikeThrough: Command = () => { exec("strikeThrough"); };

const H1: Command = () => { exec("formatBlock", "<H1>"); };
const H2: Command = () => { exec("formatBlock", "<H2>"); };
const H3: Command = () => { exec("formatBlock", "<H3>"); };

const UL: Command = () => { exec("insertUnorderedList"); };
const OL: Command = () => { exec("insertOrderedList"); };

const Outdent: Command = () => { exec("outdent"); };
const Indent: Command = () => { exec("indent"); };

const AlignLeft: Command = () => { exec("justifyLeft"); };
const AlignCenter: Command = () => { exec("justifyCenter"); };
const AlignRight: Command = () => { exec("justifyRight"); };

const InsertTabFactory: CommandFactory<{ tabSize: number }> = (props): Command => () => {
  const tabHtml: string = {
    "-1": "&#009",
    "2": "&nbsp;&nbsp;",
    "4": "&nbsp;&nbsp;&nbsp;&nbsp;"
  }[props.tabSize] || "&#009";
  exec("insertHTML", tabHtml);
};

const InsertImageFactory: CommandFactory<{ src: string }> = (props): Command => () => { exec("insertImage", props.src); };
const InsertLinkFactory: CommandFactory<{ href: string }> = (props): Command => () => { exec("createLink", props.href); };
const EmbedHtmlFactory: CommandFactory<{ html: string }> = (props): Command => () => { exec("insertHTML", props.html); };

const InsertHorizontalRule: Command = () => { exec("insertHorizontalRule"); };

const InsertCurrentDate: Command = () => { exec("insertHTML", dateUtils.getCurrentDate()); };
const InsertCurrentTime: Command = () => { exec("insertHTML", dateUtils.getCurrentTime()); };
const InsertCurrentDateAndTime: Command = () => { exec("insertHTML", dateUtils.getCurrentDateAndTime()); };

const Pre: Command = () => { exec("formatBlock", "<PRE>"); };

const RemoveFormat: Command = () => {
  exec("removeFormat");
  exec("formatBlock", "<DIV>");
};

type AvailableCommand =
  "Bold" | "Italic" | "Underline" | "StrikeThrough" |
  "H1" | "H2" | "H3" |
  "UL" | "OL" |
  "Outdent" | "Indent" |
  "AlignLeft" | "AlignCenter" | "AlignRight" |
  "InsertHorizontalRule" |
  "InsertCurrentDate" | "InsertCurrentTime" | "InsertCurrentDateAndTime" |
  "Pre" |
  "RemoveFormat"
  ;

const commands: { [key in AvailableCommand]: Command } = {
  Bold,
  Italic,
  Underline,
  StrikeThrough,

  H1,
  H2,
  H3,

  UL,
  OL,

  Outdent,
  Indent,

  AlignLeft,
  AlignCenter,
  AlignRight,

  InsertHorizontalRule,

  InsertCurrentDate,
  InsertCurrentTime,
  InsertCurrentDateAndTime,

  Pre,

  RemoveFormat,
};

export {
  commands,

  InsertTabFactory,
  InsertImageFactory,
  InsertLinkFactory,
  EmbedHtmlFactory,

  table,
  highlight,
};
