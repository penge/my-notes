import { sidebar } from "./elements";

export interface SetSidebarOptions {
  show: boolean
  width?: string
}

export default function setSidebar({ show, width }: SetSidebarOptions): void {
  if (width) {
    sidebar.style.width = width;
    sidebar.style.minWidth = width;
    document.body.style.left = width;
  }

  document.body.classList.toggle("with-sidebar", typeof show === "boolean" ? show : true);
}
