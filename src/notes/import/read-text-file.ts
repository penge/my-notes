import { Note } from "shared/storage/schema";
import { removeExtension } from "./helpers";

export type ReadTextFileResponse = { name: string, note: Note };

interface ProduceReadTextFileResponseProps {
  name: string
  content: string
  time: string
}

export const produceReadTextFileResponse = ({ name, content, time }: ProduceReadTextFileResponseProps): ReadTextFileResponse => ({
  name,
  note: {
    content,
    createdTime: time,
    modifiedTime: time,
  },
});

export const readTextFile = async (file: File): Promise<ReadTextFileResponse | null> => {
  const name = removeExtension(file.name);
  if (!name) {
    return null;
  }

  const content = await file.text();
  const time = new Date().toISOString();

  return produceReadTextFileResponse({ name, content, time });
};
