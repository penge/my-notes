export interface ReadImageProps {
  width: number
  height: number
  result: string
}

export const isImageFile = (file: File): boolean => {
  return file.type.match("image/*") !== null;
};

export const readImageFile = (file: File): Promise<ReadImageProps | undefined> => new Promise((resolve) => {
  if (!isImageFile(file)) {
    resolve(undefined);
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    const image = new Image();
    image.onload = () => resolve({
      width: image.width,
      height: image.height,
      result: reader.result as string,
    });

    image.src = reader.result as string;
  };

  reader.readAsDataURL(file);
});
