import {
  RegularFont, GoogleFont, Theme, NotesOrder,
} from "./schema";

export const validFont = (obj: unknown): obj is RegularFont | GoogleFont => {
  const isRegularFont = typeof obj === "object" && obj !== null
    && "id" in obj
    && "name" in obj
    && "genericFamily" in obj
    && "fontFamily" in obj;

  const isGoogleFont = typeof obj === "object" && obj !== null
    && "id" in obj
    && "name" in obj
    && "fontFamily" in obj
    && "href" in obj;

  return isRegularFont || isGoogleFont;
};

export const minSize = 100;
export const maxSize = 600;

export const validSize = (size: unknown): size is number => typeof size === "number" && size >= minSize && size <= maxSize;

export const validTheme = (theme: unknown): theme is Theme => {
  const light: Theme = "light";
  const dark: Theme = "dark";
  const custom: Theme = "custom";

  return theme === light || theme === dark || theme === custom;
};

export const validCustomTheme = (customTheme: unknown): customTheme is string => typeof customTheme === "string";

export const validBoolean = (value: unknown): value is boolean => typeof value === "boolean";

export const validStringArray = (value: unknown): value is Array<string> => Array.isArray(value) && value.every((entry) => typeof entry === "string");

export const validTabSize = (value: unknown): value is number => typeof value === "number" && [-1, 2, 4].includes(value);

export const validNotesOrder = (value: unknown): value is NotesOrder => Object.values(NotesOrder).includes(value as NotesOrder);
