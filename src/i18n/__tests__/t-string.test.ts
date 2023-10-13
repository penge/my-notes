import tStringCore from "../t-string";
import en from "../en.json";

const tString = (path: string, props?: Record<string, unknown>) =>
  tStringCore(en, path, props);

describe("tString()", () => {
  it("returns path if translation not found", () => {
    expect(tString("something.not.translated")).toBe("something.not.translated");
  });

  it("returns translation", () => {
    expect(
      tString("Bold.mac"),
    ).toBe("Bold (⌘ + B)");

    expect(
      tString("Bold.other"),
    ).toBe("Bold (Ctrl + B)");

    expect(
      tString("Change selected text color to", { color: "Orange" }),
    ).toBe("Change selected text color to Orange");

    expect(
      tString("Change selected text color to", { badkey: "Orange" }),
    ).toBe("Change selected text color to {{color}}");

    expect(
      tString("Google Fonts.step1", { website: "https://fonts.google.com" }),
    ).toBe("Open <a href=\"https://fonts.google.com\" target=\"_blank\">https://fonts.google.com</a> to see the available fonts");

    expect(
      tString("Google Fonts.step1"),
    ).toBe("Open <a href=\"{{website}}\" target=\"_blank\">{{website}}</a> to see the available fonts");

    expect(
      tString("Apply"),
    ).toBe("Apply");
  });

  it("can throw during development", () => {
    const OLD_NODE_ENV = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    expect(
      () => tString("something.not.translated"),
    ).toThrow("Translation for \"something.not.translated\" not found!");

    expect(
      () => tString("Change selected text color to", { badkey: "Orange" }),
    ).toThrow("Translation for \"Change selected text color to\" is missing key \"badkey\"!");

    process.env.NODE_ENV = OLD_NODE_ENV;
  });
});
