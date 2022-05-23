export interface ContentNote {
  active: string
  initialContent: string
  locked: boolean
  raw: boolean
}

export interface ContentProps {
  note: ContentNote
  onEdit: (active: string, content: string) => void
  indentOnTab: boolean
  tabSize: number
}

let latestCb: () => void;
export const reattachEditNote = (cb: () => void) => {
  document.removeEventListener("editnote", latestCb);
  latestCb = cb;
  document.addEventListener("editnote", latestCb);
};
