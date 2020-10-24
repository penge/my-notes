/* global document */

export default function setToolbar({ show }) {
  document.body.classList.toggle("with-toolbar", typeof show === "boolean" ? show : true);
}
