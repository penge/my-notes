import { ReadImageProps } from "./read-image";

const SKELETON_ID = "my-notes-image-skeleton";
const IMAGE_TO_UPLOAD_ID = "my-notes-image-to-upload";
const IMAGE_TO_UPLOAD_OVERLAY_CAPTION_ID = "my-notes-image-to-upload-overlay-caption";
const IMAGE_TO_UPLOAD_OVERLAY_ID = "my-notes-image-to-upload-overlay";

/**
 * Returns div#SKELETON_ID with three children:
 * - img#IMAGE_TO_UPLOAD_ID, that shows the image preview,
 * - div#IMAGE_TO_UPLOAD_OVERLAY_CAPTION_ID, that shows "Uploading...", and,
 * - div#IMAGE_TO_UPLOAD_OVERLAY_ID, that updates the image upload progress.
 */
export const createImageSkeleton = (props: ReadImageProps): HTMLDivElement => {
  const skeleton = document.createElement("div");
  skeleton.id = SKELETON_ID;
  skeleton.contentEditable = "false";
  skeleton.style.width = `${props.width}px`;
  skeleton.style.height = `${props.height}px`;

  const img = document.createElement("img");
  img.id = IMAGE_TO_UPLOAD_ID;
  img.src = props.result as string;

  const overlayCaption = document.createElement("div");
  overlayCaption.id = IMAGE_TO_UPLOAD_OVERLAY_CAPTION_ID;
  overlayCaption.innerHTML = "Uploading...";

  const overlay = document.createElement("div");
  overlay.id = IMAGE_TO_UPLOAD_OVERLAY_ID;
  overlay.style.width = "100%";

  skeleton.appendChild(img);
  skeleton.appendChild(overlayCaption);
  skeleton.appendChild(overlay);

  return skeleton;
};

/**
 * Updates width of div#IMAGE_TO_UPLOAD_OVERLAY_ID to match the upload progress.
 *
 * As the upload progresses, we change div#IMAGE_TO_UPLOAD_OVERLAY_ID width
 * from 100% to 0% to reveal the image behind from the left to the right.
 */
export const updateImageUploadProgress = (document: Document, progress: number): void => {
  const overlay = document.getElementById(IMAGE_TO_UPLOAD_OVERLAY_ID);
  if (!overlay) {
    return;
  }

  overlay.style.width = `${Math.abs(progress - 100)}%`;
};

export const createImageElement = (src: string, width: number, height: number): HTMLImageElement => {
  const image = new Image();
  image.id = `my-notes-image-${new Date().getTime()}`;
  image.className = "my-notes-image";
  image.src = src;
  image.width = width;
  image.height = height;
  return image;
};

export const removeSkeleton = (): void => {
  const skeleton = document.getElementById(SKELETON_ID);
  if (skeleton) {
    skeleton.remove();
  }
};

export const replaceImageSkeletonWithImage = (document: Document, image: HTMLImageElement): void => {
  const skeleton = document.getElementById(SKELETON_ID);

  if (!skeleton) {
    return;
  }

  skeleton.replaceWith(image);

  const replacedImage = document.getElementById(image.id);
  if (!replacedImage) {
    return;
  }

  const range = document.createRange();
  range.setStartAfter(replacedImage);
  range.setEndAfter(replacedImage);

  const selection = document.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
};
