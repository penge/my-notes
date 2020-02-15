/* global chrome */

/*
Commands are defined in manifest.json

focus - Toggle Focus mode
*/

const toggleFocus = () => {
  chrome.storage.local.get(["focus"], local => {
    chrome.storage.local.set({ focus: !local.focus });
  });
};

const register = (state) => chrome.commands.onCommand.addListener(command => {
  if (command === "focus" && state.active) {
    toggleFocus();
  }
});


export default { register };
