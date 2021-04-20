import { h } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { useCallback, useEffect, useRef } from "preact/hooks";
import keyboardShortcuts, { KeyboardShortcut } from "notes/keyboard-shortcuts";
import commands from "../toolbar/commands";
import dateUtils from "shared/date/date-utils";

interface ContentProps {
  active: string
  initialContent: string
  onEdit: (active: string, content: string) => void
  indentOnTab: boolean
  tabSize: number
}

const autofocus = (content: HTMLDivElement) => content && setTimeout(() => {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const range = document.createRange();
  range.setStart(content, 0);
  range.setEnd(content, 0);

  selection.removeAllRanges();
  selection.addRange(range);
});

const indentOnTabCallbackFactory = (tabSize: number) => () => commands.insertTab(tabSize);

const insertDate = () => document.execCommand("insertHTML", false, dateUtils.getCurrentDate());
const insertTime = () => document.execCommand("insertHTML", false, dateUtils.getCurrentTime());
const insertDateAndTime = () => document.execCommand("insertHTML", false, dateUtils.getCurrentDateAndTime());

let latestCb: () => void;
const reattachEditNote = (cb: () => void) => {
  document.removeEventListener("editnote", latestCb);
  latestCb = cb;
  document.addEventListener("editnote", latestCb);
};

let latestIndentOnTabCallback: () => void;
const reattachIndentOnTab = (indentOnTab: boolean, tabSize: number) => {
  keyboardShortcuts.unsubscribe(latestIndentOnTabCallback);
  if (indentOnTab) {
    latestIndentOnTabCallback = indentOnTabCallbackFactory(tabSize);
    keyboardShortcuts.subscribe(KeyboardShortcut.OnTab, latestIndentOnTabCallback);
  }
};

const Content = ({ active, initialContent, onEdit, indentOnTab, tabSize }: ContentProps): h.JSX.Element => {
  const contentRef = useRef<HTMLDivElement>();

  const onInput = useCallback(() => {
    if (active) {
      const content = contentRef.current.innerHTML;
      onEdit(active, content);
    }
  }, [active]);

  const openLink = useCallback((event: MouseEvent) => {
    if (!document.body.classList.contains("with-control")) {
      return;
    }

    event.preventDefault();
    const target = event.target;
    const href = target && (target as HTMLLinkElement).href;
    if (href && ["http", "chrome-extension"].some((protocol) => href.startsWith(protocol))) {
      window.open(href, "_blank");
    }
  }, []);

  useEffect(() => {
    contentRef.current.innerHTML = initialContent;
    autofocus(contentRef.current);
  }, [active, initialContent]);

  // Toolbar controls (e.g. TABLE_INSERT) can change #content.innerHTML.
  // To save the changed content, "editnote" event is triggered from Toolbar.
  useEffect(() => reattachEditNote(onInput), [onInput]);

  useEffect(() => reattachIndentOnTab(indentOnTab, tabSize), [indentOnTab, tabSize]);

  useEffect(() => {
    keyboardShortcuts.subscribe(KeyboardShortcut.OnUnderline, commands.underline);
    keyboardShortcuts.subscribe(KeyboardShortcut.OnStrikethrough, commands.strikeThrough);
    keyboardShortcuts.subscribe(KeyboardShortcut.OnRemoveFormat, commands.removeFormat);

    keyboardShortcuts.subscribe(KeyboardShortcut.OnUnorderedList, commands.ul);
    keyboardShortcuts.subscribe(KeyboardShortcut.OnOrderedList, commands.ol);

    keyboardShortcuts.subscribe(KeyboardShortcut.OnInsertDate, insertDate);
    keyboardShortcuts.subscribe(KeyboardShortcut.OnInsertTime, insertTime);
    keyboardShortcuts.subscribe(KeyboardShortcut.OnInsertDateAndTime, insertDateAndTime);
  }, []);

  return (
    <div
      id="content"
      ref={contentRef}
      contentEditable
      spellcheck
      autofocus
      onInput={onInput}
      onClick={openLink}
    />
  );
};

export default Content;
