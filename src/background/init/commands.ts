const attach = (): void => chrome.commands.onCommand.addListener((command) => {
  if (command === "open-my-notes") {
    chrome.tabs.create({ url: "/notes.html" });
  }
});

export default {
  attach,
};
