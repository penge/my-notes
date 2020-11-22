import { getElementById } from "dom/index";

const save = getElementById("save") as HTMLButtonElement;
const textarea = getElementById("textarea") as HTMLTextAreaElement;

save.addEventListener("click", () => {
  const customTheme = textarea.value;
  chrome.storage.local.set({ customTheme });
});

chrome.storage.local.get("customTheme", local => {
  textarea.value = local.customTheme;
  textarea.focus();
});
