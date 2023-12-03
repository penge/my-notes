import * as path from "path";
import * as fs from "fs";

const getLines = (filename: string): string[] => fs
  .readFileSync(path.join(__dirname, `../../../public/themes/${filename}`), "utf8")
  .split("\n");

describe("themes in public folder", () => {
  const lightLines = getLines("light.css");
  const darkLines = getLines("dark.css");

  test("they have same number of lines", () => {
    expect(lightLines.length).toEqual(darkLines.length);
  });

  test("they have same CSS variables", () => {
    for (let i = 0; i < lightLines.length; i += 1) {
      const isVariable = lightLines[i].startsWith("  --");
      if (!isVariable) {
        expect(lightLines[i]).toEqual(darkLines[i]);
      } else {
        const variableName = lightLines[i].split(":")[0];
        expect(darkLines[i].startsWith(variableName)).toBe(true);
      }
    }
  });
});
