// Open My Notes with 1 click on the My Notes icon in the browser's toolbar
export const openMyNotesOnIconClick = (): void => chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "/notes.html" });
});

export const openMyNotesOnKeyboardShortcut = (): void => chrome.commands.onCommand.addListener((command) => {
  if (command === "open-my-notes") {
    chrome.tabs.create({ url: "/notes.html" });
  }
});
