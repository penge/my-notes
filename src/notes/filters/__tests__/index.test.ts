import {
  normalizeFilter,
  isCommandFilter,
} from "..";

/**
 * Expectations:
 * - whitespace is trimmed
 * - filter is lowercased
 */
test("normalizeFilter() normalizes note filter", () => {
  // 1 word
  expect(normalizeFilter("  article ")).toBe("article");
  expect(normalizeFilter("  Article ")).toBe("article");
  expect(normalizeFilter("  ARTICLE ")).toBe("article");

  // 2 words
  expect(normalizeFilter("  Today Shopping ")).toBe("today shopping");
});

/**
 * Expectations:
 * - whitespace is trimmed (even after the > symbol)
 * - filter is lowercased
 */
test("normalizeFilter() normalizes command filter", () => {
  // 1 word
  expect(normalizeFilter(" >   Time ")).toBe("> time");

  // 2 words
  expect(normalizeFilter(" >   Current Time ")).toBe("> current time");
});

test("isCommandFilter returns false for non-command filter", () => {
  expect(isCommandFilter("article")).toBe(false);
});

test("isCommandFilter returns true for command filter", () => {
  expect(isCommandFilter("> time")).toBe(true);
});
