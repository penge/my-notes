import { JSDOM } from "jsdom";
import { Theme } from "shared/storage/schema";
import { setTheme } from "../set-theme";

const __expectOnlyOneChildInHead = (dom: JSDOM) => {
  // only 1 theme should be inserted, changing theme should remove the previous theme
  expect(dom.window.document.head.children.length).toBe(1);
};

const __expectInsertedLinkElement = (dom: JSDOM, expectedTheme: Theme) => {
  __expectOnlyOneChildInHead(dom);

  const linkElement = dom.window.document.head.firstChild as HTMLLinkElement;
  expect(linkElement.id).toBe("theme");
  expect(linkElement.rel).toBe("stylesheet");
  expect(linkElement.href).toBe(`themes/${expectedTheme}.css`);
};

const __expectInsertedStyleElement = (dom: JSDOM, expectedCustomTheme: string) => {
  __expectOnlyOneChildInHead(dom);

  const styleElement = dom.window.document.head.firstChild as HTMLStyleElement;
  expect(styleElement.id).toBe("theme");
  expect(styleElement.innerHTML).toBe(expectedCustomTheme);
};

const __expectUpdatedBody = (dom: JSDOM, expectedId: Theme) => {
  expect(dom.window.document.body.id).toBe(expectedId);
  expect(dom.window.document.body.style.opacity).toBe("1");
};

test("light theme is inserted", () => {
  const dom = new JSDOM();
  setTheme(dom.window.document, { theme: "light" });

  __expectInsertedLinkElement(dom, "light");
  __expectUpdatedBody(dom, "light");
});

test("dark theme is inserted", () => {
  const dom = new JSDOM();
  setTheme(dom.window.document, { theme: "dark" });

  __expectInsertedLinkElement(dom, "dark");
  __expectUpdatedBody(dom, "dark");
});

test("custom theme is inserted", () => {
  const dom = new JSDOM();
  setTheme(dom.window.document, { theme: "custom", customTheme: "body{color:#333;}" });

  __expectInsertedStyleElement(dom, "body{color:#333;}");
  __expectUpdatedBody(dom, "custom");
});

test("custom theme fallbacks to light theme if customTheme string is not provided", () => {
  const customThemes = [undefined, "", "  "]; // all should result in using light theme instead
  customThemes.forEach((customTheme) => {
    const dom = new JSDOM();
    setTheme(dom.window.document, { theme: "custom", customTheme });

    __expectInsertedLinkElement(dom, "light");
    __expectUpdatedBody(dom, "light");
  });
});

test("changing theme should remove the previous theme", () => {
  const dom = new JSDOM();
  setTheme(dom.window.document, { theme: "light" }); // inserting light theme first
  setTheme(dom.window.document, { theme: "dark" }); // then inserting dark theme

  __expectInsertedLinkElement(dom, "dark"); // already tests only 1 theme should be inserted
  __expectUpdatedBody(dom, "dark");
});

test("using the same theme again should insert the theme only once", () => {
  const dom = new JSDOM();
  setTheme(dom.window.document, { theme: "light" });
  setTheme(dom.window.document, { theme: "light" });

  __expectInsertedLinkElement(dom, "light"); // already tests only 1 theme should be inserted
  __expectUpdatedBody(dom, "light");
});
