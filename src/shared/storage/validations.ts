import { RegularFont, GoogleFont, Theme } from "./schema";

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

export const validSize = (size: unknown): size is number => {
  return typeof size === "number" && size >= 100 && size <= 600;
};

export const validTheme = (theme: unknown): theme is Theme => {
  const light: Theme = "light";
  const dark: Theme = "dark";
  const custom: Theme = "custom";

  return theme === light || theme === dark || theme === custom;
};

export const validCustomTheme = (customTheme: unknown): customTheme is string => {
  return typeof customTheme === "string";
};

export const validBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};
