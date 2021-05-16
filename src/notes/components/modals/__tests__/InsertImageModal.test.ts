import {
  transformImageUrl,
} from "../InsertImageModal";

test("transformImageUrl() transforms Google Drive image url", () => {
  expect(transformImageUrl("https://drive.google.com/file/d/1y0v9S/view"))
    .toBe("https://drive.google.com/uc?id=1y0v9S");

  expect(transformImageUrl("https://anything.com/any-image.png"))
    .toBe("https://anything.com/any-image.png");
});
