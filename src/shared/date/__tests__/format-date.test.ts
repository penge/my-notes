import formatDate from "../format-date";

it("returns US format date string", () => {
  expect(
    formatDate(new Date("2021-01-08T09:41:01Z").toISOString())
  ).toBe("January 8, 9:41:01 AM");

  expect(
    formatDate(new Date("2021-01-25T14:30:58Z").toISOString())
  ).toBe("January 25, 2:30:58 PM");
});
