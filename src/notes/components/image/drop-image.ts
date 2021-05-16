import { h } from "preact";
import { isImageFile, readImageFile } from "./read-image";
import {
  createImageSkeleton,
  updateImageUploadProgress,
  createImageElement,
  replaceImageSkeletonWithImage,
  removeSkeleton,
} from "./image-skeleton";
import { uploadImage } from "./upload-image";
import { Sync } from "shared/storage/schema";

interface DropImageProps {
  event: h.JSX.TargetedDragEvent<HTMLDivElement>
  sync: Sync
  token: string
  file: File
  onComplete: () => void
}

export const getBase64FromDataURL = (dataUrl: string): string => dataUrl.replace(/^data:(.*,)?/, "");

export const dropImage = async ({ event, sync, token, file, onComplete }: DropImageProps): Promise<void> => {
  if (!isImageFile(file)) {
    return;
  }

  const imageProps = await readImageFile(file);
  if (!imageProps) {
    return;
  }

  // 1. Insert image skeleton
  const skeleton = createImageSkeleton(imageProps);
  const range = document.caretRangeFromPoint(event.clientX, event.clientY);
  range.insertNode(skeleton);

  // 2. Upload the image
  uploadImage({
    sync,
    token,
    image: {
      name: file.name,
      type: file.type,
      data: getBase64FromDataURL(imageProps.result),
      width: imageProps.width,
      height: imageProps.height,
    },
    onProgress: (progress: number) => updateImageUploadProgress(document, progress),
    onUploaded: (src: string, width: number, height: number) => {
      const image = createImageElement(src, width, height);
      image.onload = () => {
        // 3. Replace the skeleton with the uploaded image
        document.body.classList.remove("locked");
        replaceImageSkeletonWithImage(document, image);
        onComplete();
      };
    },
    onError: () => {
      removeSkeleton();
      document.body.classList.remove("locked");
    },
  });
};
