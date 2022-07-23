import formatDate, { FormatDateOption } from "../format-date";

it("returns empty string for invalid date", () => {
  expect(formatDate("")).toBe("");
  expect(formatDate("foo-bar")).toBe("");
});

it("returns US format date string", () => {
  expect(formatDate("2021-01-08T09:41:01Z")).toBe("2021 January 8, 9:41:01 AM");
  expect(formatDate("2021-01-25T14:30:58Z")).toBe("2021 January 25, 2:30:58 PM");
});

it("can return date only", () => {
  expect(formatDate("2021-01-25T14:30:58Z", FormatDateOption.ONLY_DATE)).toBe("2021 January 25");
});

it("can return time only", () => {
  expect(formatDate("2021-01-25T14:30:58Z", FormatDateOption.ONLY_TIME)).toBe("2:30:58 PM");
});
