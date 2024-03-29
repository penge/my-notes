import {
  NotesObject, NotesOrder, Storage, StorageKey,
} from "shared/storage/schema";
import defaultValuesFactory from "shared/storage/default-values-factory";
import {
  validBoolean,
  validStringArray,
  validCustomTheme,
  validFont,
  validSize,
  validTabSize,
  validTheme,
  validNotesOrder,
} from "shared/storage/validations";

export const localKeys: StorageKey[] = [
  // Appearance
  "font",
  "size",
  "theme",
  "customTheme",
  "sidebar",
  "toolbar",

  // Notes
  "notes",
  "order",
  "active",
  "setBy",
  "lastEdit",

  // Options
  "notesOrder",
  "focus",
  "tab",
  "tabSize",
  "autoSync",
  "openNoteOnMouseHover",
];

export default (sync: { [key: string]: unknown }, local: { [key: string]: unknown }): Storage => {
  const defaultValues = defaultValuesFactory(true);

  // Get the notes from a previous version
  let notes = // eslint-disable-line operator-linebreak
    // 1.x
    sync.value     // string => [1.4], [1.3], [1.2]
    || sync.newtab // string => [1.1.1], [1.1], [1.0]
    // early 2.x
    || sync.notes  // array => [2.0], [2.0.1], [2.0.2], [2.1]
    // later 2.x and 3.x
    || local.notes // array => [2.2], [2.x]; object => [3.x]
    // DEFAULT
    || defaultValues.notes; // object => [3.x]

  // Migrate the notes from [1.x] to [2.x] (from a string => to an array of strings)
  if (typeof notes === "string") {
    notes = [notes, "", ""];
  }

  // Migrate the notes from [2.x] to [3.x] (from an array of strings => to an object)
  if (Array.isArray(notes) && notes.length === 3 && notes.every((note) => typeof note === "string")) {
    const time = new Date().toISOString();
    const createdTime = time;
    const modifiedTime = time;
    notes = {
      One: { content: notes[0], createdTime, modifiedTime },   // before 1/3
      Two: { content: notes[1], createdTime, modifiedTime },   // before 2/3
      Three: { content: notes[2], createdTime, modifiedTime }, // before 3/3
    };
  }

  const tryNote = (noteName: string): string | null => ((noteName in (notes as NotesObject))
    ? noteName
    : null);

  const firstAvailableNote = Object.keys(notes as NotesObject).sort()[0] || null;

  const storage: Storage = {
    // Appearance
    font: validFont(local.font) ? local.font : defaultValues.font,
    size: validSize(local.size) ? local.size : defaultValues.size,
    theme: validTheme(local.theme) ? local.theme : defaultValues.theme,
    customTheme: validCustomTheme(local.customTheme) ? local.customTheme : defaultValues.customTheme,
    sidebar: validBoolean(local.sidebar) ? local.sidebar : defaultValues.sidebar,
    toolbar: validBoolean(local.toolbar) ? local.toolbar : defaultValues.toolbar,

    // Notes
    notes: notes as NotesObject, // already migrated to [3.x]
    order: validStringArray(local.order) ? local.order : [],
    active: tryNote(local.active as string) || tryNote(defaultValues.active as string) || firstAvailableNote,
    setBy: typeof local.setBy === "string" ? local.setBy : defaultValues.setBy,
    lastEdit: typeof local.lastEdit === "string" ? local.lastEdit : defaultValues.lastEdit,

    // Options
    notesOrder: validNotesOrder(local.notesOrder) ? local.notesOrder : NotesOrder.Alphabetical,
    focus: validBoolean(local.focus) ? local.focus : defaultValues.focus,
    tab: validBoolean(local.tab) ? local.tab : defaultValues.tab,
    tabSize: validTabSize(local.tabSize) ? local.tabSize : defaultValues.tabSize,
    autoSync: validBoolean(local.autoSync) ? local.autoSync : defaultValues.autoSync,
    openNoteOnMouseHover: validBoolean(local.openNoteOnMouseHover) ? local.openNoteOnMouseHover : defaultValues.openNoteOnMouseHover,
  };

  return storage;
};
