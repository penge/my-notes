import { Theme } from "shared/storage/schema";

const reset = () => {
  const elem = document.getElementById("theme");
  elem && elem.remove();
};

const insertTheme = (theme: Theme) => {
  const link = document.createElement("link");
  link.id = "theme";
  link.rel = "stylesheet";
  link.href = `themes/${theme}.css`;
  document.getElementsByTagName("head")[0].appendChild(link);
  document.body.id = theme;
};

const insertCustomTheme = (customTheme: string) => {
  const style = document.createElement("style");
  style.id = "theme";
  style.innerHTML = customTheme;
  document.getElementsByTagName("head")[0].appendChild(style);
  document.body.id = "custom";
};

export interface SetThemeOptions {
  name: Theme
  customTheme?: string
}

export default function setTheme({ name, customTheme }: SetThemeOptions): void {
  reset();

  if (name === "light" || name === "dark") {
    insertTheme(name);
  }

  if (name === "custom") {
    if (customTheme && customTheme.length > 0) {
      insertCustomTheme(customTheme);
    } else {
      insertTheme("light");
    }
  }
}
