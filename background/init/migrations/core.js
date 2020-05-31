import defaultValues, {
  // Appearance
  validFont,
  validSize,
  validTheme,
  validCustomTheme,

  // Options
  validFocus,
  validNewtab,
  validTab,
} from "../../../shared/storage/default-values.js";

export default (sync, local) => {
  // Get the notes from a previous version
  let notes =
    // 1.x
    sync.value ||  // string => [1.4], [1.3], [1.2]
    sync.newtab || // string => [1.1.1], [1.1], [1.0]
    // early 2.x
    sync.notes ||  // array => [2.0], [2.0.1], [2.0.2], [2.1]
    // later 2.x and 3.x
    local.notes || // array => [2.2], [2.x]; object => [3.x]
    // DEFAULT
    defaultValues.notes(); // object => [3.x]

  // Migrate the notes from [1.x] to [2.x] (from a string => to an array of strings)
  if (typeof notes === "string") {
    notes = [notes, "", ""];
  }

  // Migrate the notes from [2.x] to [3.x] (from an array of strings => to an object)
  if (Array.isArray(notes) && notes.length === 3 && notes.every(note => typeof note === "string")) {
    const time = new Date().toISOString();
    const createdTime = time;
    const modifiedTime = time;
    notes = {
      One: { content: notes[0], createdTime, modifiedTime },   // before 1/3
      Two: { content: notes[1], createdTime, modifiedTime },   // before 2/3
      Three: { content: notes[2], createdTime, modifiedTime }, // before 3/3
      Clipboard: { content: "", createdTime, modifiedTime },
    };
  }

  return {
    // Appearance
    font: validFont(local.font) ? local.font : defaultValues.font,
    size: validSize(local.size) ? local.size : defaultValues.size,
    theme: validTheme(local.theme) ? local.theme : defaultValues.theme,
    customTheme: validCustomTheme(local.customTheme) ? local.customTheme : defaultValues.customTheme,

    // Notes
    notes: notes, // already migrated to [3.x]
    active: (local.active in notes) ? local.active : defaultValues.active,

    // Options
    focus: validFocus(local.focus) ? local.focus : defaultValues.focus,
    newtab: validNewtab(local.newtab) ? local.newtab : defaultValues.newtab,
    tab: validTab(local.tab) ? local.tab : defaultValues.tab,
  };
};
