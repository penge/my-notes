import { Note } from "shared/storage/schema";

export const readFile = (file: File, callback: (newNote: Note) => void): void => {
  const reader = new FileReader();
  reader.onloadend = () => {
    const time = new Date(file.lastModified).toISOString();
    const content = reader.result as string;

    const newNote: Note = {
      content,
      createdTime: time,
      modifiedTime: time,
    };

    callback(newNote);
  };

  reader.readAsText(file);
};
