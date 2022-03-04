import en from "../en.json";
import { capitalize } from "shared/string/capitalize-string";

test("all root keys start with uppercase letter", () => {
  expect(
    Object
      .keys(en)
      .map((key) => key === capitalize(key))
      .every((expectation) => expectation === true)
  ).toBe(true);
});

test("no key contains a dot character", () => { // Reason: "." is used to find translation
  const keys: string[] = [];
  const appendKeys = (object: Record<string, unknown>) => {
    Object.keys(object).forEach((key) => {
      keys.push(key);

      if (typeof object[key] === "object") {
        appendKeys(object[key] as Record<string, unknown>);
      }
    });
  };

  appendKeys(en);

  expect(keys.every((key) => !key.includes("."))).toBe(true);
});
