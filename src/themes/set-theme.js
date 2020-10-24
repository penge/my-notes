/* global document */

const reset = () => {
  const elem = document.getElementById("theme");
  elem && elem.remove();
};

const insertTheme = (theme) => {
  const link = document.createElement("link");
  link.id = "theme";
  link.rel = "stylesheet";
  link.href = `themes/${theme}.css`;
  document.getElementsByTagName("head")[0].appendChild(link);
  document.body.id = theme;
};

const insertCustomTheme = (customTheme) => {
  const style = document.createElement("style");
  style.id = "theme";
  style.innerHTML = customTheme;
  document.getElementsByTagName("head")[0].appendChild(style);
  document.body.id = "custom";
};

export default function setTheme(theme, customTheme) {
  reset();

  if (theme === "light" || theme === "dark") {
    insertTheme(theme);
  }

  if (theme === "custom") {
    if (typeof customTheme === "string" && customTheme.length > 0) {
      insertCustomTheme(customTheme);
    } else {
      insertTheme("light");
    }
  }
}
