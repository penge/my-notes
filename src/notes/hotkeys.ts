const isMac = (os: string) => os === "mac";

export enum Hotkey {
  // Options
  OnOpenOptions,

  // Toggles
  OnToggleFocusMode,
  OnToggleSidebar,
  OnToggleToolbar,

  // Controls
  OnControl,
  OnEscape,
  OnEnter,
  OnTab,

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

const callbacksByHotkey: {
  [key: string]: Callback[]
} = {};

const publish = (hotkey: Hotkey, event: KeyboardEvent): void => {
  const key: string = Hotkey[hotkey];
  const callbacks = callbacksByHotkey[key];
  if (!callbacks || !callbacks.length) {
    return; // no callbacks for the hotkey
  }

  if (![Hotkey.OnControl, Hotkey.OnEscape].includes(hotkey)) {
    event.preventDefault();
  }

  callbacks.forEach((callback) => callback());
};

const registerOpenOptions = (event: KeyboardEvent, os: string) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.code === "KeyO") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && event.code === "KeyO")
  ) {
    publish(Hotkey.OnOpenOptions, event);
  }
};

const registerToggleFocusMode = (event: KeyboardEvent, os: string) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.code === "KeyF") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && event.code === "KeyF")
  ) {
    publish(Hotkey.OnToggleFocusMode, event);
  }
};

const registerToggleSidebar = (event: KeyboardEvent, os: string) => {
  if (
    (isMac(os) && event.metaKey && !event.shiftKey && event.code === "KeyS") ||
    (!isMac(os) && event.ctrlKey && !event.shiftKey && event.code === "KeyS")
  ) {
    publish(Hotkey.OnToggleSidebar, event);
  }
};

const registerToggleToolbar = (event: KeyboardEvent, os: string) => {
  if (
    (isMac(os) && event.metaKey && event.code === "KeyE") ||
    (!isMac(os) && event.ctrlKey && event.code === "KeyE")
  ) {
    publish(Hotkey.OnToggleToolbar, event);
  }
};

const registerControl = (event: KeyboardEvent, os: string) => {
  if (
    (isMac(os) && event.metaKey) ||
    (!isMac(os) && event.ctrlKey)
  ) {
    publish(Hotkey.OnControl, event);
  }
};

const registerEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    publish(Hotkey.OnEscape, event);
  }
};

const registerEnter = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    publish(Hotkey.OnEnter, event);
  }
};

const registerTab = (event: KeyboardEvent) => {
  if (event.key === "Tab") {
    publish(Hotkey.OnTab, event);
  }
};

const registerUnderline = (event: KeyboardEvent, os: string) => {
  if (isMac(os) && event.metaKey && event.code === "KeyU") {
    publish(Hotkey.OnUnderline, event);
  }
};

const registerStrikethrough = (event: KeyboardEvent, os: string) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.code === "KeyX") ||
    (!isMac(os) && event.altKey && event.shiftKey && event.code === "Digit5")
  ) {
    publish(Hotkey.OnStrikethrough, event);
  }
};

const registerRemoveFormat = (event: KeyboardEvent, os: string) => {
  if (
    (isMac(os) && event.metaKey && event.code === "Backslash") ||
    (!isMac(os) && event.ctrlKey && event.code === "Backslash")
  ) {
    publish(Hotkey.OnRemoveFormat, event);
  }
};

const registerUnorderedList = (event: KeyboardEvent, os: string) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.code === "Digit7") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && event.code === "Digit7")
  ) {
    publish(Hotkey.OnUnorderedList, event);
  }
};

const registerOrderedList = (event: KeyboardEvent, os: string) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.code === "Digit8") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && event.code === "Digit8")
  ) {
    publish(Hotkey.OnOrderedList, event);
  }
};

const registerInsertDate = (event: KeyboardEvent, os: string) => {
  if (
    (isMac(os) && event.metaKey && !event.shiftKey && !event.altKey && event.code === "Semicolon") ||
    (!isMac(os) && event.ctrlKey && !event.shiftKey && !event.altKey && event.code === "Semicolon")
  ) {
    publish(Hotkey.OnInsertDate, event);
  }
};

const registerInsertTime = (event: KeyboardEvent, os: string) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && !event.altKey && event.code === "Semicolon") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && !event.altKey && event.code === "Semicolon")
  ) {
    publish(Hotkey.OnInsertTime, event);
  }
};

const registerInsertDateAndTime = (event: KeyboardEvent, os: string) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.altKey && event.code === "Semicolon") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && event.altKey && event.code === "Semicolon")
  ) {
    publish(Hotkey.OnInsertDateAndTime, event);
  }
};

const registerSyncNotes = (event: KeyboardEvent, os: string) => {
  if (
    (isMac(os) && event.metaKey && event.shiftKey && event.code === "KeyS") ||
    (!isMac(os) && event.ctrlKey && event.shiftKey && event.code === "KeyS")
  ) {
    publish(Hotkey.OnSync, event);
  }
};

const keydown = (os: string) => document.addEventListener("keydown", (event) => {
  // Options
  registerOpenOptions(event, os);

  // Toggles
  registerToggleFocusMode(event, os);
  registerToggleSidebar(event, os);
  registerToggleToolbar(event, os);

  // Controls
  registerControl(event, os);
  registerEscape(event);
  registerEnter(event);
  registerTab(event);

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

const register = (os: "mac" | "other"): void => {
  keydown(os);
  keyup();
};

const subscribe = (hotkey: Hotkey, callback: Callback): void => {
  const key: string = Hotkey[hotkey];
  callbacksByHotkey[key] = [
    ...(callbacksByHotkey[key] || []),
    callback,
  ];
};

const unsubscribe = (callbackToRemove: Callback): void => {
  Object.keys(callbacksByHotkey).forEach((key) => {
    callbacksByHotkey[key] = callbacksByHotkey[key].filter((callback) => callback !== callbackToRemove);
  });
};

export default {
  register,
  subscribe,
  unsubscribe,
};
