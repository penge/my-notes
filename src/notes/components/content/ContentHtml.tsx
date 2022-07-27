import { h } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";
import runUploadPreconditions from "background/google-drive/preconditions/run-upload-preconditions";
import { KeyboardShortcut } from "notes/keyboard-shortcuts";
import { useKeyboardShortcut } from "notes/hooks/use-keyboard-shortcut";
import __range from "notes/range";
import { reinitTables } from "notes/content/table";
import { commands, InsertTabFactory } from "../../commands";
import { ContentProps, reattachEditNote } from "./common";

import { isImageFile } from "../image/read-image";
import { dropImage } from "../image/drop-image";

const focus = (content: HTMLDivElement) => content && window.setTimeout(() => {
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

const openLink = (event: MouseEvent) => {
  if (!document.body.classList.contains("with-control")) {
    return;
  }

  event.preventDefault();
  const { target } = event;
  const href = target && (target as HTMLLinkElement).href;
  if (href && ["http", "chrome-extension"].some((protocol) => href.startsWith(protocol))) {
    window.open(href, "_blank");
  }
};

const ContentHtml = ({
  note, onEdit, indentOnTab, tabSize,
}: ContentProps): h.JSX.Element => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [setIndentOnTabHandlerOnTab] = useKeyboardShortcut(KeyboardShortcut.OnTab);

  useEffect(() => setIndentOnTabHandlerOnTab(
    indentOnTab
      ? InsertTabFactory({ tabSize })
      : undefined,
  ), [indentOnTab, tabSize]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = note.initialContent;
      focus(contentRef.current);
      reinitTables({
        onResize: () => {
          const event = new Event("editnote");
          document.dispatchEvent(event);
        },
      });
    }
  }, [note.active, note.initialContent]);

  const onInput = useCallback(() => {
    if (note.active && contentRef.current) {
      const content = contentRef.current.innerHTML;
      onEdit(note.active, content);
    }
  }, [note.active]);

  // Toolbar controls (e.g. TABLE_INSERT) can change #content.innerHTML.
  // To save the changed content, "editnote" event is triggered from Toolbar.
  useEffect(() => reattachEditNote(onInput), [onInput]);

  const [onUnderline] = useKeyboardShortcut(KeyboardShortcut.OnUnderline);
  const [onStrikethrough] = useKeyboardShortcut(KeyboardShortcut.OnStrikethrough);
  const [onRemoveFormat] = useKeyboardShortcut(KeyboardShortcut.OnRemoveFormat);

  const [onUnorderedList] = useKeyboardShortcut(KeyboardShortcut.OnUnorderedList);
  const [onOrderedList] = useKeyboardShortcut(KeyboardShortcut.OnOrderedList);

  const [onInsertDate] = useKeyboardShortcut(KeyboardShortcut.OnInsertDate);
  const [onInsertTime] = useKeyboardShortcut(KeyboardShortcut.OnInsertTime);
  const [onInsertDateAndTime] = useKeyboardShortcut(KeyboardShortcut.OnInsertDateAndTime);

  useEffect(() => {
    onUnderline(commands.Underline);
    onStrikethrough(commands.StrikeThrough);
    onRemoveFormat(commands.RemoveFormat);

    onUnorderedList(commands.UL);
    onOrderedList(commands.OL);

    onInsertDate(commands.InsertCurrentDate);
    onInsertTime(commands.InsertCurrentTime);
    onInsertDateAndTime(commands.InsertCurrentDateAndTime);
  }, []);

  return (
    <div
      id="content"
      className={note.locked ? "locked" : undefined}
      ref={contentRef}
      contentEditable
      spellCheck
      autoFocus
      onInput={onInput}
      onClick={openLink}
      onDragEnter={() => {
        __range.empty();
      }}
      onDrop={async (event) => {
        const file = event.dataTransfer?.files[0];
        if (!file || !isImageFile(file)) {
          return;
        }

        event.preventDefault();
        document.body.classList.add("locked");

        const result = await runUploadPreconditions();
        if (!result) {
          document.body.classList.remove("locked");
          return;
        }

        const { sync, token } = result;
        await dropImage({
          event,
          sync,
          token,
          file,
          onComplete: onInput,
        });
      }}
    />
  );
};

export default ContentHtml;
