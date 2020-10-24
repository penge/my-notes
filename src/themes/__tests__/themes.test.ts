import * as path from "path";
import * as fs from "fs";

const getLines = (filename: string): string[] =>
  fs.readFileSync(path.join(__dirname, `../../../static/themes/${filename}`), "utf8").split("\n");

it("has the same CSS variables", () => {
  const lightLines = getLines("light.css");
  const darkLines = getLines("dark.css");

  // Themes have the same length
  expect(lightLines.length).toEqual(darkLines.length);

  // Themes have the same lines, variable names
  for (let i = 0; i < lightLines.length; i += 1) {
    const isVariable = lightLines[i].startsWith("  --");
    if (!isVariable) {
      expect(lightLines[i]).toEqual(darkLines[i]);
      continue;
    }

    const variableName = lightLines[i].split(":")[0];
    expect(darkLines[i].startsWith(variableName)).toBe(true);
  }
});
