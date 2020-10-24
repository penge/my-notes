/* global document */

import { sidebar } from "./elements.js";

export default function setSidebar({ show, width }) {
  if (width) {
    sidebar.style.width = width;
    sidebar.style.minWidth = width;
    document.body.style.left = width;
  }

  document.body.classList.toggle("with-sidebar", typeof show === "boolean" ? show : true);
}
