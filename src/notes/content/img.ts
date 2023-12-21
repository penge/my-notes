import { dispatchNoteEdited } from "notes/events";

const MIN_ZOOM = 0.1;
const ZOOM_STEP = 0.003;

/* eslint-disable no-param-reassign */
const makeImgZoomable = (img: HTMLImageElement) => {
  img.onwheel = (event) => {
    if (!document.body.classList.contains("with-control")) {
      return;
    }

    document.body.classList.add("resizing-img");

    const zoomChange = ZOOM_STEP * event.deltaY;
    // @ts-ignore
    const parsedZoom = parseFloat(img.style.zoom);
    // @ts-ignore
    img.style.zoom = Math.max(MIN_ZOOM, (Number.isNaN(parsedZoom) ? 1 : parsedZoom) + zoomChange);
  };
  img.ondblclick = () => {
    // @ts-ignore
    img.style.zoom = "";
    dispatchNoteEdited();
  };
};

// eslint-disable-next-line import/prefer-default-export
export const initImgs = () => {
  const imgs = document.querySelectorAll<HTMLImageElement>("body > #content-container > #content img");
  imgs.forEach(makeImgZoomable);
};
