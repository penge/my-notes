export interface SetToolbarOptions {
  show: boolean
}

export default function setToolbar({ show }: SetToolbarOptions): void {
  document.body.classList.toggle("with-toolbar", show);
}
