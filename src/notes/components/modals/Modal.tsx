import { h } from "preact";
import { useRef, useEffect, useCallback } from "preact/hooks";
import { useBodyClass } from "notes/hooks/use-body-class";
import { useKeyboardShortcut, KeyboardShortcut } from "notes/hooks/use-keyboard-shortcut";

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
  useBodyClass("with-modal");

  const inputRef = useRef<HTMLInputElement>(null);

  const [setOnCancelHandlerOnEscape] = useKeyboardShortcut(KeyboardShortcut.OnEscape);
  const [setOnSubmitHandlerOnEnter] = useKeyboardShortcut(KeyboardShortcut.OnEnter);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = inputValue ?? "";
      inputRef.current.focus();
    }
  }, [inputRef, inputValue]);

  const onSubmit = useCallback(() => {
    const value = inputRef.current ? inputRef.current.value.trim() : "";
    const isValid = validate ? validate(value) : true;
    if (isValid) {
      onConfirm(value);
    }
  }, [onConfirm, validate]);

  useEffect(() => setOnCancelHandlerOnEscape(onCancel), [onCancel]);
  useEffect(() => setOnSubmitHandlerOnEnter(onSubmit), [onSubmit]);

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
