import {
  NotesObject,
  Storage,
} from "./schema";

const getDefaultNotes = (): NotesObject => {
  const time = new Date().toISOString();
  const createdTime = time;
  const modifiedTime = time;

  return {
    One: { content: "", createdTime, modifiedTime },
    Two: { content: "", createdTime, modifiedTime },
    Three: { content: "", createdTime, modifiedTime },
    Clipboard: { content: "", createdTime, modifiedTime },
  };
};

const defaultValuesFactory = (generateNotes?: boolean): Storage => {
  const notes = generateNotes ? getDefaultNotes() : {};

  return {
    // Appearance
    font: {
      id: "helvetica",
      name: "Helvetica",
      genericFamily: "sans-serif",
      fontFamily: "Helvetica, sans-serif",
    },
    size: 200,
    sidebar: true,
    toolbar: true,
    theme: "light",
    customTheme: "", // css string

    // Notes
    notes,
    active: null,

    // Options
    focus: false,
    newtab: false,
    tab: false,
  };
};

export {
  defaultValuesFactory,
};
