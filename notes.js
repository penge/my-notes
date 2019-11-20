/* global chrome */

const textarea = document.getElementById("textarea");

chrome.storage.sync.get(["newtab"], result => {
  textarea.value = result.newtab || "";
});

textarea.addEventListener("keyup", () => {
  chrome.storage.sync.set({ newtab: textarea.value });
});
