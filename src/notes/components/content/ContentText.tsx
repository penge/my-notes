import { h } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { KeyboardShortcut } from "notes/keyboard-shortcuts";
import { useKeyboardShortcut } from "notes/hooks/use-keyboard-shortcut";
import { InsertTabFactory } from "../../commands";
import { ContentProps, reattachEditNote } from "./common";

const focus = (content: HTMLTextAreaElement) => content && window.setTimeout(() => {
  content.focus();
  content.setSelectionRange(0, 0);
});

const ContentText = ({
  note, onEdit, indentOnTab, tabSize,
}: ContentProps): h.JSX.Element => {
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const [setIndentOnTabHandlerOnTab] = useKeyboardShortcut(KeyboardShortcut.OnTab);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.value = note.initialContent;
      focus(contentRef.current);
    }
  }, [note.active, note.initialContent]);

  const onInput = useCallback(() => {
    if (note.active && contentRef.current) {
      const content = contentRef.current.value;
      onEdit(note.active, content);
    }
  }, [note.active]);

  useEffect(() => reattachEditNote(onInput), [onInput]);

  useEffect(() => setIndentOnTabHandlerOnTab(
    indentOnTab
      ? InsertTabFactory({ tabSize })
      : undefined,
  ), [indentOnTab, tabSize]);

  return (
    <textarea
      id="content"
      className={note.locked ? "locked" : undefined}
      ref={contentRef}
      spellCheck
      autoFocus
      onInput={onInput}
    />
  );
};

export default ContentText;
