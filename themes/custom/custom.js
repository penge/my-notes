/* global chrome, document */

const save = document.getElementById("save");
const textarea = document.getElementById("textarea");

save.addEventListener("click", () => {
  const customTheme = textarea.value;
  chrome.storage.local.set({ customTheme });
});

chrome.storage.local.get("customTheme", local => {
  textarea.value = local.customTheme;
  textarea.focus();
});
