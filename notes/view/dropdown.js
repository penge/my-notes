/* global document */

export const closeDropdown = (d) => d.classList.remove("open");
export const closeDropdowns = () => {
  const dropdowns = document.getElementsByClassName("dropdown");
  for (const d of dropdowns) {
    closeDropdown(d);
  }
};
