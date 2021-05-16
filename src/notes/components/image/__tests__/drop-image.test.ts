import {
  getBase64FromDataURL,
} from "../drop-image";

test("getBase64FromDataURL() returns base64 from data URL", () => {
  const dataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASA";
  const base64 = getBase64FromDataURL(dataURL);
  expect(base64).toBe("/9j/4AAQSkZJRgABAQEASA");
});
