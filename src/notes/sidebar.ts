import { sidebar, drag } from "./view/elements";

let m_pos: number;
function resize(e: MouseEvent) {
  const dx = (m_pos - e.x) * -1;
  m_pos = e.x;

  const width = window.innerWidth;
  const max = width / 2; // 50%
  if (m_pos >= max) {
    document.body.classList.add("resizing-sidebar-locked-max");
    return;
  }

  const min = ((width / 100) * .3); // .3%
  if (m_pos <= min) {
    document.body.classList.add("resizing-sidebar-locked-min");
    return;
  }

  document.body.classList.remove("resizing-sidebar-locked-min", "resizing-sidebar-locked-max");

  const sidebarWidth = parseInt(window.getComputedStyle(sidebar).width) + dx;
  sidebar.style.width = sidebarWidth + "px";
  document.body.style.left = sidebarWidth + "px";
}

const register = (): void => {
  drag.addEventListener("mousedown", (e) => {
    m_pos = e.x;
    document.body.classList.add("resizing-sidebar");
    sidebar.style.minWidth = "";
    document.addEventListener("mousemove", resize);
  });

  drag.addEventListener("dblclick", () => {
    sidebar.style.width = "";
    sidebar.style.minWidth = "";
    document.body.style.left = "";

    setTimeout(() => {
      chrome.storage.local.remove("sidebarWidth");
    });
  });

  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", resize);
    document.body.classList.remove("resizing-sidebar", "resizing-sidebar-locked-min", "resizing-sidebar-locked-max");
    const sidebarWidth = sidebar.style.width;
    sidebar.style.minWidth = sidebarWidth;
    chrome.storage.local.set({ sidebarWidth });
  });
};

export default { register };
