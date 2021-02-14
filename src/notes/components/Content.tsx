import { h } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { useCallback, useEffect, useRef } from "preact/hooks";
import hotkeys, { Hotkey } from "notes/hotkeys";
import commands from "../toolbar/commands";
import dateUtils from "shared/date/date-utils";

interface ContentProps {
  active: string
  initialContent: string
  onEdit: (active: string, content: string) => void
  indentOnTab: boolean
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

const indentOnTabCallback = () => document.execCommand("insertHTML", false, "&#009");

const insertDate = () => document.execCommand("insertHTML", false, dateUtils.getCurrentDate());
const insertTime = () => document.execCommand("insertHTML", false, dateUtils.getCurrentTime());
const insertDateAndTime = () => document.execCommand("insertHTML", false, dateUtils.getCurrentDateAndTime());

let latestCb: () => void;
const reattachEditNote = (cb: () => void) => {
  document.removeEventListener("editnote", latestCb);
  latestCb = cb;
  document.addEventListener("editnote", latestCb);
};

const Content = ({ active, initialContent, onEdit, indentOnTab }: ContentProps): h.JSX.Element => {
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
    const target = event.target as HTMLLinkElement;
    if (target && target.href && target.href.startsWith("http")) {
      window.open(target.href, "_blank");
    }
  }, []);

  useEffect(() => {
    contentRef.current.innerHTML = initialContent;
    autofocus(contentRef.current);
  }, [initialContent]);

  // Toolbar controls (e.g. TABLE_INSERT) can change #content.innerHTML.
  // To save the changed content, "editnote" event is triggered from Toolbar.
  useEffect(() => reattachEditNote(onInput), [onInput]);

  useEffect(() => {
    hotkeys.unsubscribe(indentOnTabCallback);
    if (indentOnTab) {
      hotkeys.subscribe(Hotkey.OnTab, indentOnTabCallback);
    }
  }, [indentOnTab]);

  useEffect(() => {
    hotkeys.subscribe(Hotkey.OnUnderline, commands.underline);
    hotkeys.subscribe(Hotkey.OnStrikethrough, commands.strikeThrough);
    hotkeys.subscribe(Hotkey.OnRemoveFormat, commands.removeFormat);

    hotkeys.subscribe(Hotkey.OnUnorderedList, commands.ul);
    hotkeys.subscribe(Hotkey.OnOrderedList, commands.ol);

    hotkeys.subscribe(Hotkey.OnInsertDate, insertDate);
    hotkeys.subscribe(Hotkey.OnInsertTime, insertTime);
    hotkeys.subscribe(Hotkey.OnInsertDateAndTime, insertDateAndTime);
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
