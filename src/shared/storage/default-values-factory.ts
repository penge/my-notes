import {
  NotesObject,
  NotesOrder,
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
  };
};

export default (generateNotes?: boolean): Storage => {
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
    theme: "light",
    customTheme: "", // css string
    sidebar: true,
    toolbar: true,

    // Notes
    notes,
    order: [],
    active: "One",
    setBy: "",
    lastEdit: "",

    // Options
    notesOrder: NotesOrder.Alphabetical,
    focus: false,
    tab: false,
    tabSize: -1,
    autoSync: false,
    openNoteOnMouseHover: false,
  };
};
