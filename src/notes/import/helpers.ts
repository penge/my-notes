export const removeExtension = (filename: string) => filename.split(".").slice(0, -1).join(".");
export const getExtension = (filename: string) => filename.slice((Math.max(0, filename.lastIndexOf(".")) || Infinity) + 1);
