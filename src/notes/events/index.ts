const NoteEdited = "NoteEdited";

export const dispatchNoteEdited = () => {
  document.dispatchEvent(new Event(NoteEdited));
};

let latestCb: () => void;
export const reattachOnNoteEdited = (cb: () => void) => {
  document.removeEventListener(NoteEdited, latestCb);
  latestCb = cb;
  document.addEventListener(NoteEdited, latestCb);
};
