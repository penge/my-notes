import { h } from "preact";
import { render } from "@testing-library/preact";
import { t, tString } from "i18n";

const getInnerHtml = (element: h.JSX.Element) => render(element).container.innerHTML;

describe("t()", () => {
  it("returns translation", () => {
    expect(
      getInnerHtml(t("Bold.mac"))
    ).toBe("<span>Bold (⌘ + B)</span>");

    expect(
      getInnerHtml(t("Bold.other"))
    ).toBe("<span>Bold (Ctrl + B)</span>");

    expect(
      getInnerHtml(t("Change selected text color to", { color: "Orange" }))
    ).toBe("<span>Change selected text color to Orange</span>");

    expect(
      getInnerHtml(t("Change selected text color to", { badkey: "Orange" }))
    ).toBe("<span>Change selected text color to {{color}}</span>");

    expect(
      getInnerHtml(t("Google Fonts.step1", { website: "https://fonts.google.com" }))
    ).toBe("<span>Open <a href=\"https://fonts.google.com\" target=\"_blank\">https://fonts.google.com</a> to see the available fonts</span>");

    expect(
      getInnerHtml(t("Google Fonts.step1"))
    ).toBe("<span>Open <a href=\"{{website}}\" target=\"_blank\">{{website}}</a> to see the available fonts</span>");

    expect(
      getInnerHtml(t("Apply"))
    ).toBe("<span>Apply</span>");
  });

  it("returns path", () => {
    expect(
      getInnerHtml(t("something.not.translated"))
    ).toBe("<span>something.not.translated</span>");
  });
});

describe("tString()", () => {
  it("returns string", () => {
    expect(tString("Apply")).toBe("Apply");
    expect(tString("something.not.translated")).toBe("something.not.translated");
  });

  it("can throw during development", () => {
    const OLD_NODE_ENV = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    expect(
      () => tString("something.not.translated")
    ).toThrow("Translation for \"something.not.translated\" not found!");

    expect(
      () => t("Change selected text color to", { badkey: "Orange" })
    ).toThrow("Translation for \"Change selected text color to\" is missing key \"badkey\"!");

    process.env.NODE_ENV = OLD_NODE_ENV;
  });
});
