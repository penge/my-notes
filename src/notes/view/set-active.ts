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

const setActiveInSidebar = (name: string) => {
  const notes = document.querySelectorAll<HTMLElement>("#sidebar-notes .note");
  notes.forEach((note) => {
    note.classList.toggle("active", note.innerText === name);
  });
};

export default function setActive(name: string, html: string): void {
  document.title = name;

  content.innerHTML = html;

  setActiveInSidebar(name);
  autofocus();
}
