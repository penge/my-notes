import { Os } from "shared/storage/schema";
import dateUtils from "shared/date/date-utils";
import table from "./table";
import highlight from "./highlight";

export interface Command {
  name: string
  title: (os: Os) => string
  execute: () => void
}

type CommandFactory<P> = (props: P) => Command;

const exec = (command: string, value?: string): boolean =>
  document.execCommand(command, false, value);

const Bold: Command = {
  name: "Bold",
  title: (os) => ({
    mac: "Bold (⌘ + B)",
    other: "Bold (Ctrl + B)"
  })[os],
  execute: (): void => { exec("bold"); },
};

const Italic: Command = {
  name: "Italic",
  title: (os) => ({
    mac: "Italic (⌘ + I)",
    other: "Italic (Ctrl + I)"
  })[os],
  execute: (): void => { exec("italic"); }
};

const Underline: Command = {
  name: "Underline",
  title: (os) => ({
    mac: "Underline (⌘ + U)",
    other: "Underline (Ctrl + U)"
  })[os],
  execute: (): void => { exec("underline"); }
};

const StrikeThrough: Command = {
  name: "StrikeThrough",
  title: (os) => ({
    mac: "Strikethrough (⌘ + Shift + X)",
    other: "Strikethrough (Alt + Shift + 5)"
  })[os],
  execute: (): void => { exec("strikeThrough"); }
};

const H1: Command = {
  name: "H1",
  title: () => "",
  execute: (): void => { exec("formatBlock", "<H1>"); }
};

const H2: Command = {
  name: "H2",
  title: () => "",
  execute: (): void => { exec("formatBlock", "<H2>"); }
};

const H3: Command = {
  name: "H3",
  title: () => "",
  execute: (): void => { exec("formatBlock", "<H3>"); }
};

const UL: Command = {
  name: "UL",
  title: (os) => ({
    mac: "Bulleted List (⌘ + Shift + 7)",
    other: "Bulleted List (Ctrl + Shift + 7)"
  })[os],
  execute: (): void => { exec("insertUnorderedList"); }
};

const OL: Command = {
  name: "OL",
  title: (os) => ({
    mac: "Numbered List (⌘ + Shift + 8)",
    other: "Numbered List (Ctrl + Shift + 8)"
  })[os],
  execute: (): void => { exec("insertOrderedList"); }
};

const Outdent: Command = {
  name: "Outdent",
  title: () => "",
  execute: (): void => { exec("outdent"); }
};

const Indent: Command = {
  name: "Indent",
  title: () => "",
  execute: (): void => { exec("indent"); }
};

const AlignLeft: Command = {
  name: "Align Left",
  title: () => "",
  execute: (): void => { exec("justifyLeft"); }
};

const AlignCenter: Command = {
  name: "Align Center",
  title: () => "",
  execute: (): void => { exec("justifyCenter"); }
};

const AlignRight: Command = {
  name: "Align Right",
  title: () => "",
  execute: (): void => { exec("justifyRight"); }
};

const InsertTabFactory: CommandFactory<{ tabSize: number }> = (props): Command => ({
  name: "Insert Tab",
  title: () => "",
  execute: (): void => {
    const tabHtml: string = {
      "-1": "&#009",
      "2": "&nbsp;&nbsp;",
      "4": "&nbsp;&nbsp;&nbsp;&nbsp;"
    }[props.tabSize] || "&#009";
    exec("insertHTML", tabHtml);
  }
});

const InsertImageFactory: CommandFactory<{ src: string }> = (props): Command => ({
  name: "Insert Image",
  title: () => "",
  execute: (): void => { exec("insertImage", props.src); }
});

const InsertLinkFactory: CommandFactory<{ href: string }> = (props): Command => ({
  name: "Insert Link",
  title: () => "",
  execute: (): void => { exec("createLink", props.href); }
});

const InsertCurrentDate: Command = {
  name: "Insert current Date",
  title: () => "",
  execute: (): void => { exec("insertHTML", dateUtils.getCurrentDate()); }
};

const InsertCurrentTime: Command = {
  name: "Insert current Time",
  title: () => "",
  execute: (): void => { exec("insertHTML", dateUtils.getCurrentTime()); }
};

const InsertCurrentDateAndTime: Command = {
  name: "Insert current Date and Time",
  title: () => "",
  execute: (): void => { exec("insertHTML", dateUtils.getCurrentDateAndTime()); }
};

const Pre: Command = {
  name: "Code Block",
  title: () => "",
  execute: (): void => { exec("formatBlock", "<PRE>"); }
};

const RemoveFormat: Command = {
  name: "Remove Formatting",
  title: (os) => ({
    mac: "Remove Formatting (⌘ + \\)",
    other: "Remove Formatting (Ctrl + \\)"
  })[os],
  execute: (): void => {
    exec("removeFormat");
    exec("formatBlock", "<DIV>");
  }
};

type AvailableCommand =
  "Bold" | "Italic" | "Underline" | "StrikeThrough" |
  "H1" | "H2" | "H3" |
  "UL" | "OL" |
  "Outdent" | "Indent" |
  "AlignLeft" | "AlignCenter" | "AlignRight" |
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

  table,
  highlight,
};
