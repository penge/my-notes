import { Theme } from "shared/storage/schema";

const reset = (document: Document) => {
  const elem = document.getElementById("theme");
  elem && elem.remove();
};

const appendTheme = (document: Document, element: HTMLLinkElement | HTMLStyleElement, theme: Theme) => {
  document.head.appendChild(element);
  document.body.id = theme;
  document.body.style.opacity = "1";
};

const insertTheme = (document: Document, theme: Theme) => {
  const link = document.createElement("link");
  link.id = "theme";
  link.rel = "stylesheet";
  link.href = `themes/${theme}.css`;
  appendTheme(document, link, theme);
};

const insertCustomTheme = (document: Document, customTheme: string) => {
  const style = document.createElement("style");
  style.id = "theme";
  style.innerHTML = customTheme;
  document.getElementsByTagName("head")[0].appendChild(style);
  appendTheme(document, style, "custom");
};

export interface SetThemeOptions {
  theme: Theme
  customTheme?: string
}

export function setTheme(document: Document, { theme, customTheme }: SetThemeOptions): void {
  reset(document);

  if (theme === "light" || theme === "dark") {
    insertTheme(document, theme);
  }

  if (theme === "custom") {
    if (customTheme && customTheme.trim().length > 0) {
      insertCustomTheme(document, customTheme);
    } else {
      insertTheme(document, "light");
    }
  }
}
