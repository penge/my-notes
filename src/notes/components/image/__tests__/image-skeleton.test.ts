import { JSDOM } from "jsdom";
import {
  createImageSkeleton,
  updateImageUploadProgress,
  createImageElement,
  replaceImageSkeletonWithImage,
} from "../image-skeleton";

const skeletonFactory = () => createImageSkeleton({
  width: 300,
  height: 200,
  result: "IMAGE_CONTENT",
});

const prepareDom = (skeleton: HTMLDivElement): JSDOM => {
  const dom = new JSDOM();
  dom.window.document.body.insertAdjacentHTML("afterbegin", skeleton.outerHTML);
  return dom;
};

test("createImageSkeleton() returns HTML skeleton", () => {
  const dom = prepareDom(skeletonFactory());

  /* eslint-disable quotes */
  expect(dom.window.document.body.innerHTML).toBe(
    '<div id="my-notes-image-skeleton" style="width: 300px; height: 200px;">' +
      '<img id="my-notes-image-to-upload" src="IMAGE_CONTENT">' +
      '<div id="my-notes-image-to-upload-overlay-caption">Uploading...</div>' +
      '<div id="my-notes-image-to-upload-overlay" style="width: 100%;"></div>' +
    '</div>'
  );
});

test("updateImageUploadProgress() updates image upload progress for the skeleton", () => {
  const dom = prepareDom(skeletonFactory());

  const getElement = () => dom.window.document.getElementById("my-notes-image-to-upload-overlay") as HTMLDivElement;

  expect(getElement().style.width).toBe("100%"); // initial width should be 100%

  updateImageUploadProgress(dom.window.document, 30);
  expect(getElement().style.width).toBe("70%");

  updateImageUploadProgress(dom.window.document, 50);
  expect(getElement().style.width).toBe("50%");

  updateImageUploadProgress(dom.window.document, 80);
  expect(getElement().style.width).toBe("20%");

  updateImageUploadProgress(dom.window.document, 100);
  expect(getElement().style.width).toBe("0%");
});

test("createImageElement() returns Image element", () => {
  const spy = jest.spyOn(Date.prototype, "getTime").mockReturnValue(1610098861000); // "2021-01-08T09:41:01Z"

  const image = createImageElement("http://localhost/image.jpeg", 600, 400);
  expect(image.id).toBe("my-notes-image-1610098861000");
  expect(image.className).toBe("my-notes-image");
  expect(image.src).toBe("http://localhost/image.jpeg");
  expect(image.width).toBe(600);
  expect(image.height).toBe(400);

  spy.mockRestore();
});

test("replaceImageSkeletonWithImage() replaces skeleton with the image", () => {
  const dom = prepareDom(skeletonFactory());
  expect(dom.window.document.getElementById("my-notes-image-skeleton")).toBeTruthy();

  const image = dom.window.document.createElement("img");
  replaceImageSkeletonWithImage(dom.window.document, image);

  expect(dom.window.document.getElementById("my-notes-image-skeleton")).toBeFalsy();
  expect(dom.window.document.body.innerHTML).toBe("<img>");
});
