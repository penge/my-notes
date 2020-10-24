/* global fetch, console */

import runTests from "../../../../tests/run-tests.js";

const getLines = async (file) => {
  const response = await fetch(file);
  const css = await response.text();
  const lines = css.split("\n");
  return lines;
};

const test = async () => {
  const lightLines = await getLines("../light.css");
  const darkLines = await getLines("../dark.css");

  // Themes have the same length
  console.assert(lightLines.length === darkLines.length);

  // Themes have the same lines, variable names
  for (let i = 0; i < lightLines.length; i += 1) {
    const isVariable = lightLines[i].startsWith("  --");
    if (!isVariable) {
      console.assert(lightLines[i] === darkLines[i]);
      continue;
    }
    const variableName = lightLines[i].split(":")[0];
    console.assert(darkLines[i].startsWith(variableName));
  }
};

runTests("themes/__tests__/themes.test.js", [
  test,
]);
