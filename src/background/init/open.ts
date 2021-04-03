// Open My Notes with 1 click on the My Notes icon in the browser's toolbar
const iconClick = () => chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "/notes.html" });
});

export default {
  attach: (): void => {
    iconClick();
  }
};
