const openMyNotes = () => chrome.tabs.create({ url: "/notes.html" });

// Open My Notes with 1 click on the My Notes icon in the browser's toolbar
export const openMyNotesOnIconClick = (): void => chrome.action.onClicked.addListener(openMyNotes);

// Open My Notes with hotkey
// See chrome://extensions/shortcuts to customize
// By default: CMD + SHIFT + M
export const openMyNotesOnKeyboardShortcut = (): void => chrome.commands.onCommand.addListener((command) => {
  if (command === "open-my-notes") {
    openMyNotes();
  }
});
