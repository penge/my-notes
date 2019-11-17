/* global chrome */

var initialized = false;
var textarea = document.getElementById("textarea");

chrome.storage.sync.get(["newtab"], function (result) {
  textarea.value = result.newtab || '';
  initialized = true;
});

textarea.addEventListener("input", function () {
  if (!initialized) {
    return;
  }
  chrome.storage.sync.set({ newtab: textarea.value });
});
