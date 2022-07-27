import { h } from "preact";
import {
  useRef, useState, useEffect, useMemo, useCallback,
} from "preact/hooks";
import clsx from "clsx";
import useBodyClass from "notes/hooks/use-body-class";
import { useKeyboardShortcut, KeyboardShortcut } from "notes/hooks/use-keyboard-shortcut";

interface ModalProps {
  className?: string
  title?: string
  input?: {
    type: "text" | "textarea"
    defaultValue?: string
  }
  validate?: (inputValue: string) => boolean
  cancel?: {
    cancelValue: string
    onCancel: () => void
  }
  confirm: {
    confirmValue: string
    onConfirm: (inputValue: string) => void
  }
  description?: h.JSX.Element
}

const Modal = ({
  className, title, input, validate, cancel, confirm, description,
}: ModalProps): h.JSX.Element => {
  useBodyClass("with-modal");

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [inputValue, setInputValue] = useState<string>(input?.defaultValue || "");

  useEffect(() => {
    if (!input) {
      return;
    }

    const inputToFocus = {
      text: inputRef.current,
      textarea: textareaRef.current,
    }[input.type];

    if (!inputToFocus) {
      return;
    }

    inputToFocus.value = inputValue;
    inputToFocus.focus();
  }, [input, inputValue]);

  const onInput = useCallback((event: h.JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement, Event>) => {
    const { value } = event.target as HTMLInputElement | HTMLTextAreaElement;
    setInputValue(value);
  }, []);

  const onSubmit = useMemo(() => {
    const value = inputValue.trim();
    const isValid = validate ? validate(value) : true;
    if (!isValid) {
      return undefined;
    }
    return () => { confirm.onConfirm(value); };
  }, [inputValue, validate, confirm.onConfirm]);

  const [setOnCancelHandlerOnEscape] = useKeyboardShortcut(KeyboardShortcut.OnEscape);
  const [setOnSubmitHandlerOnEnter] = useKeyboardShortcut(KeyboardShortcut.OnEnter);

  useEffect(() => setOnCancelHandlerOnEscape(cancel?.onCancel), [cancel?.onCancel]);
  useEffect(() => setOnSubmitHandlerOnEnter(onSubmit), [onSubmit]);

  return (
    <div id="modal" className={className}>
      {title && (
        <div className="bold">{title}</div>
      )}

      {input?.type === "text" && (
        <input
          id="input"
          type="text"
          ref={inputRef}
          onBlur={() => inputRef.current?.focus()}
          autoComplete="off"
          value={inputValue}
          onInput={onInput}
        />
      )}

      {input?.type === "textarea" && (
        <textarea
          id="textarea"
          ref={textareaRef}
          onBlur={() => textareaRef.current?.focus()}
          autoComplete="off"
          value={inputValue}
          onInput={onInput}
        />
      )}

      <div id="buttons">
        {cancel && (
          <input
            type="button"
            value={cancel.cancelValue}
            onClick={cancel.onCancel}
          />
        )}
        <input
          type="submit"
          value={confirm.confirmValue}
          className={clsx("bold", !onSubmit && "disabled")}
          onClick={onSubmit}
        />
      </div>

      {description}
    </div>
  );
};

export default Modal;
