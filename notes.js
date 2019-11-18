/* global chrome */

const textarea = document.getElementById("textarea");

chrome.storage.sync.get(["newtab"], result => {
  textarea.value = result.newtab || "";
  textarea.addEventListener("click", () => {
document.getElementById("textarea").classList.remove('blur');
})
  textarea.addEventListener("input", () => {
    chrome.storage.sync.set({ newtab: textarea.value });
  });
});
