export const exec = (command: string, value?: string): boolean =>
  document.execCommand(command, false, value);

const bold = (): void => { exec("bold"); };
const italic = (): void => { exec("italic"); };
const underline = (): void => { exec("underline"); };
const strikeThrough = (): void => { exec("strikeThrough"); };

const h1 = (): void => { exec("formatBlock", "<H1>"); };
const h2 = (): void => { exec("formatBlock", "<H2>"); };
const h3 = (): void => { exec("formatBlock", "<H3>"); };

const ul = (): void => { exec("insertUnorderedList"); };
const ol = (): void => { exec("insertOrderedList"); };

const outdent = (): void => { exec("outdent"); };
const indent = (): void => { exec("indent"); };

const left = (): void => { exec("justifyLeft"); };
const center = (): void => { exec("justifyCenter"); };
const right = (): void => { exec("justifyRight"); };

const insertTab = (): void => { exec("insertHTML", "&#009"); };
const insertImage = (src: string): void => { exec("insertImage", src); };
const insertLink = (href: string): void => { exec("createLink", href); };

const pre = (): void => { exec("formatBlock", "<PRE>"); };
import table from "./table";
import highlight from "./highlight";

const removeFormat = (): void => {
  exec("removeFormat");
  exec("formatBlock", "<DIV>");
};

export default {
  bold,
  italic,
  underline,
  strikeThrough,

  h1,
  h2,
  h3,

  ul,
  ol,

  outdent,
  indent,

  left,
  center,
  right,

  insertTab,
  insertImage,
  insertLink,

  pre,
  table,
  highlight,

  removeFormat,
};
