import { unzipSync, UnzipFileFilter } from "fflate";
import { ReadTextFileResponse, produceReadTextFileResponse } from "./read-text-file";
import { getExtension, removeExtension } from "./helpers";

export const nameFilter = (filename: string): boolean => !filename.startsWith("__MACOSX/")
  && ["html", "txt"].includes(getExtension(filename).toLowerCase());

const filter: UnzipFileFilter = (file) => nameFilter(file.name);

export const readZipFile = async (file: File): Promise<ReadTextFileResponse[]> => {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);

  const decompressed = unzipSync(data, { filter });
  const time = new Date().toISOString();

  const decoder = new TextDecoder();
  const decompressedNotes = Object.keys(decompressed).map((key) => {
    const name = removeExtension(key);
    const content = decoder.decode(decompressed[key]);

    return produceReadTextFileResponse({ name, content, time });
  });

  return decompressedNotes;
};
