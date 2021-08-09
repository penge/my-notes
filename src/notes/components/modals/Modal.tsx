import { h } from "preact";
import { useRef, useEffect, useCallback } from "preact/hooks";
import keyboardShortcuts, { KeyboardShortcut } from "notes/keyboard-shortcuts";

interface ModalProps {
  className?: string
  title?: string
  input?: boolean
  inputValue?: string
  cancelValue?: string
  confirmValue: string
  validate?: (inputValue: string) => boolean
  onCancel?: () => void
  onConfirm: (inputValue: string) => void
  description?: h.JSX.Element
}

const Modal = ({
  className, title, input, inputValue, cancelValue, confirmValue, validate, onCancel, onConfirm, description,
}: ModalProps): h.JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.classList.add("with-modal");
    return () => document.body.classList.remove("with-modal");
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = inputValue ?? "";
      inputRef.current.focus();
    }
  }, [inputRef]);

  const onSubmit = useCallback(() => {
    const value = inputRef.current ? inputRef.current.value.trim() : "";
    const isValid = validate ? validate(value) : true;
    if (isValid) {
      onConfirm(value);
    }
  }, []);

  useEffect(() => {
    if (cancelValue && onCancel) {
      keyboardShortcuts.subscribe(KeyboardShortcut.OnEscape, onCancel);
    }
    keyboardShortcuts.subscribe(KeyboardShortcut.OnEnter, onSubmit);

    return () => {
      if (cancelValue && onCancel) {
        keyboardShortcuts.unsubscribe(onCancel);
      }
      keyboardShortcuts.unsubscribe(onSubmit);
    };
  }, []);

  return (
    <div id="modal" className={className}>
      {title && (
        <div class="bold">{title}</div>
      )}

      {input && (
        <input
          type="text"
          id="input"
          ref={inputRef}
          onBlur={() => inputRef.current?.focus()}
          autocomplete="off"
        />
      )}

      <div id="buttons">
        {cancelValue && onCancel && (
          <input
            type="button"
            value={cancelValue}
            onClick={onCancel}
          />
        )}
        <input
          type="submit"
          value={confirmValue}
          class="bold"
          onClick={onSubmit}
        />
      </div>

      {description}
    </div>
  );
};

export default Modal;
