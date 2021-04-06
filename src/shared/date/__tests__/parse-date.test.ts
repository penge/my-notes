import parseDate, { ParsedDate } from "../parse-date";

it("returns undefined for invalid date", () => {
  expect(parseDate("")).toBe(undefined);
  expect(parseDate("foo-bar")).toBe(undefined);
});

it("returns parsed date", () => {
  const date = "2021-01-08T09:41:01Z";
  const expected: ParsedDate = {
    year: "2021",
    month: "January",
    day: "8",
    date: "2021 January 8",
    time: "9:41:01 AM",
    dateTime: "2021 January 8, 9:41:01 AM"
  };

  expect(parseDate(date)).toEqual(expected);
});
