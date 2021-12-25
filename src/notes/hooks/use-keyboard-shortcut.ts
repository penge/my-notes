import { useRef, useState, useEffect, useCallback } from "preact/hooks";
import keyboardShortcuts, { KeyboardShortcut, Callback } from "notes/keyboard-shortcuts";
export { KeyboardShortcut } from "notes/keyboard-shortcuts";

type Handler = undefined | Callback;

export const useKeyboardShortcut = (keyboardShortcut: KeyboardShortcut) => {
  const lastHandler = useRef<Handler>(undefined);
  const [handler, __setHandler] = useState<Handler>();

  useEffect(() => {
    if (lastHandler.current) {
      keyboardShortcuts.unsubscribe(lastHandler.current);
    }

    if (handler) {
      lastHandler.current = handler;
      keyboardShortcuts.subscribe(keyboardShortcut, lastHandler.current);
    }

    return () => {
      if (lastHandler.current) {
        keyboardShortcuts.unsubscribe(lastHandler.current);
      }
    };
  }, [handler]);

  const setHandler = useCallback((handler: Handler) => {
    __setHandler(() => handler);
  }, []);

  return [setHandler];
};
