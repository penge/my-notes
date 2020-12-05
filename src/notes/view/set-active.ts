import { content } from "./elements";

const autofocus = () => {
  setTimeout(() => {
    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    const range = document.createRange();
    range.setStart(content, 0);
    range.setEnd(content, 0);

    selection.removeAllRanges();
    selection.addRange(range);
  });
};

const setActiveInSidebar = (noteName: string) => {
  const notes = document.querySelectorAll<HTMLElement>("#sidebar-notes .note");
  notes.forEach((note) => {
    note.classList.toggle("active", note.innerText === noteName);
  });
};

export default function setActive(noteName: string, html: string): void {
  document.title = noteName;

  content.innerHTML = html;

  setActiveInSidebar(noteName);
  autofocus();
}
