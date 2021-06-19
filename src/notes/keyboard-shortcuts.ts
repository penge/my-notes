import { Os } from "shared/storage/schema";

const isMac = (os: Os) => os === "mac";

export enum KeyboardShortcut {
  // Options
  OnOpenOptions,

  // Toggles
  OnToggleFocusMode,
  OnToggleSidebar,
  OnToggleToolbar,
  OnToggleCommandPalette,

  // Controls
  OnControl,
  OnEscape,
  OnEnter,
  OnTab,

  // Commands
  OnRepeatLastExecutedCommand,

  // Formatting
  OnUnderline,
  OnStrikethrough,
  OnRemoveFormat,

  // Lists
  OnUnorderedList,
  OnOrderedList,

  // Date
  OnInsertDate,
  OnInsertTime,
  OnInsertDateAndTime,

  // Sync notes
  OnSync,
}

type Callback = () => void;

const callbacksByKeyboardShortcut: {
  [shortcut: string]: Callback[] | undefined
} = {};

const publish = (keyboardShortcut: KeyboardShortcut, event: KeyboardEvent): void => {
  const callbacks = callbacksByKeyboardShortcut[KeyboardShortcut[keyboardShortcut]];
  if (!callbacks || !callbacks.length) {
    return; // no callbacks for keyboard shortcut
  }

  if (![KeyboardShortcut.OnControl, KeyboardShortcut.OnEscape].includes(keyboardShortcut)) {
    event.preventDefault();
  }

  callbacks.forEach((callback) => callback());
};

const registerOpenOptions = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.code === "KeyO") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && event.code === "KeyO")
  ) {
    publish(KeyboardShortcut.OnOpenOptions, event);
  }
};

const registerToggleFocusMode = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.code === "KeyF") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && event.code === "KeyF")
  ) {
    publish(KeyboardShortcut.OnToggleFocusMode, event);
  }
};

const registerToggleSidebar = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && !event.shiftKey && event.code === "KeyS") ||
    (!isMac(os) && event.ctrlKey && !event.shiftKey && event.code === "KeyS")
  ) {
    publish(KeyboardShortcut.OnToggleSidebar, event);
  }
};

const registerToggleToolbar = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && event.code === "KeyE") ||
    (!isMac(os) && event.ctrlKey && event.code === "KeyE")
  ) {
    publish(KeyboardShortcut.OnToggleToolbar, event);
  }
};

const registerToggleCommandPalette = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && !event.shiftKey && event.code === "KeyP") ||
    (!isMac(os) && event.ctrlKey && !event.shiftKey && event.code === "KeyP")
  ) {
    publish(KeyboardShortcut.OnToggleCommandPalette, event);
  }
};

const registerControl = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && !event.shiftKey) ||
    (!isMac(os) && event.ctrlKey && !event.shiftKey)
  ) {
    publish(KeyboardShortcut.OnControl, event);
  }
};

const registerEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    publish(KeyboardShortcut.OnEscape, event);
  }
};

const registerEnter = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    publish(KeyboardShortcut.OnEnter, event);
  }
};

const registerTab = (event: KeyboardEvent) => {
  if (event.key === "Tab") {
    publish(KeyboardShortcut.OnTab, event);
  }
};

const registerRepeatLastExecutedCommand = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.code === "KeyP") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && event.code === "KeyP")
  ) {
    publish(KeyboardShortcut.OnRepeatLastExecutedCommand, event);
  }
};

const registerUnderline = (event: KeyboardEvent, os: Os) => {
  if (isMac(os) && event.metaKey && event.code === "KeyU") {
    publish(KeyboardShortcut.OnUnderline, event);
  }
};

const registerStrikethrough = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.code === "KeyX") ||
    (!isMac(os) && event.altKey && event.shiftKey && event.code === "Digit5")
  ) {
    publish(KeyboardShortcut.OnStrikethrough, event);
  }
};

const registerRemoveFormat = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && event.code === "Backslash") ||
    (!isMac(os) && event.ctrlKey && event.code === "Backslash")
  ) {
    publish(KeyboardShortcut.OnRemoveFormat, event);
  }
};

const registerUnorderedList = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.code === "Digit7") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && event.code === "Digit7")
  ) {
    publish(KeyboardShortcut.OnUnorderedList, event);
  }
};

const registerOrderedList = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.code === "Digit8") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && event.code === "Digit8")
  ) {
    publish(KeyboardShortcut.OnOrderedList, event);
  }
};

const registerInsertDate = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && !event.shiftKey && !event.altKey && event.code === "Semicolon") ||
    (!isMac(os) && event.ctrlKey && !event.shiftKey && !event.altKey && event.code === "Semicolon")
  ) {
    publish(KeyboardShortcut.OnInsertDate, event);
  }
};

const registerInsertTime = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && !event.altKey && event.code === "Semicolon") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && !event.altKey && event.code === "Semicolon")
  ) {
    publish(KeyboardShortcut.OnInsertTime, event);
  }
};

const registerInsertDateAndTime = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.altKey && event.code === "Semicolon") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && event.altKey && event.code === "Semicolon")
  ) {
    publish(KeyboardShortcut.OnInsertDateAndTime, event);
  }
};

const registerSyncNotes = (event: KeyboardEvent, os: Os) => {
  if (
    (isMac(os) && event.metaKey && event.code === "KeyR") ||
    (!isMac(os) && event.ctrlKey && event.code === "KeyR")
  ) {
    publish(KeyboardShortcut.OnSync, event);
  }
};

const keydown = (os: Os) => document.addEventListener("keydown", (event) => {
  // Options
  registerOpenOptions(event, os);

  // Toggles
  registerToggleFocusMode(event, os);
  registerToggleSidebar(event, os);
  registerToggleToolbar(event, os);
  registerToggleCommandPalette(event, os);

  // Controls
  registerControl(event, os);
  registerEscape(event);
  registerEnter(event);
  registerTab(event);

  // Commands
  registerRepeatLastExecutedCommand(event, os);

  // Formatting
  registerUnderline(event, os);
  registerStrikethrough(event, os);
  registerRemoveFormat(event, os);

  // Lists
  registerUnorderedList(event, os);
  registerOrderedList(event, os);

  // Date
  registerInsertDate(event, os);
  registerInsertTime(event, os);
  registerInsertDateAndTime(event, os);

  // Sync notes
  registerSyncNotes(event, os);
});

const keyup = () => document.addEventListener("keyup", () => {
  document.body.classList.remove("with-control");
});

const register = (os: Os): void => {
  keydown(os);
  keyup();
};

const subscribe = (keyboardShortcut: KeyboardShortcut, callback: Callback): void => {
  const shortcut: string = KeyboardShortcut[keyboardShortcut];
  callbacksByKeyboardShortcut[shortcut] = [
    ...(callbacksByKeyboardShortcut[shortcut] || []),
    callback,
  ];
};

const unsubscribe = (callbackToRemove: Callback): void => {
  Object.keys(callbacksByKeyboardShortcut).forEach((shortcut) => {
    callbacksByKeyboardShortcut[shortcut] = (callbacksByKeyboardShortcut[shortcut] || []).filter((callback) => callback !== callbackToRemove);
  });
};

export default {
  register,
  subscribe,
  unsubscribe,
};
