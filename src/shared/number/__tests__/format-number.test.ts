import formatNumber from "../format-number";

it("returns US format number", () => {
  expect(formatNumber(0)).toBe("0");
  expect(formatNumber(100)).toBe("100");
  expect(formatNumber(5325)).toBe("5,325");
});
