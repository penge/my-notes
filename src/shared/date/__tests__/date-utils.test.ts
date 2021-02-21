import dateUtils from "shared/date/date-utils";

beforeAll(() => {
  jest.spyOn(Date.prototype, "toISOString").mockReturnValue("2021-01-08T09:41:01Z");
});

afterAll(() => {
  jest.restoreAllMocks();
});

it("returns current date", () => {
  expect(
    dateUtils.getCurrentDate()
  ).toBe("January 8");
});

it("returns current time", () => {
  expect(
    dateUtils.getCurrentTime()
  ).toBe("9:41:01 AM");
});

it("returns current date and time", () => {
  expect(
    dateUtils.getCurrentDateAndTime()
  ).toBe("January 8, 9:41:01 AM");
});
