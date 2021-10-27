export const downloadURL = (data: string, fileName: string): void => {
  const a = document.createElement("a");
  a.href = data;
  a.download = fileName;
  a.click();
  a.remove();
};

export const downloadBlob = (data: Uint8Array, fileName: string, mimeType: string): void => {
  const blob = new Blob([data], {
    type: mimeType,
  });

  const url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  window.setTimeout(() => window.URL.revokeObjectURL(url), 2000);
};
