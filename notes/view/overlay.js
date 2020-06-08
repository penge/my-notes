/* global document */

export const showOverlay = (clazz) => {
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.className = clazz; // "to-rename" or "to-delete"
  document.body.appendChild(overlay);
  document.body.classList.add("with-overlay");
};

export const removeOverlay = () => {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.remove();
    document.body.classList.remove("with-overlay");
  }
};
