import { h } from "preact";

import en from "./en.json";

const CURRENT_LANGUAGE = en;

export const tString = (path: string, props?: Record<string, unknown>): string => {
  let lastNode: unknown = CURRENT_LANGUAGE;
  path.split(".").forEach((key) => {
    if (typeof lastNode === "object" && lastNode !== null) {
      lastNode = (lastNode as Record<string, unknown>)[key];
    }
  });

  if (typeof lastNode !== "string") {
    if (process.env.NODE_ENV === "development") {
      throw Error(`Translation for "${path}" not found!`);
    }

    return path;
  }

  let translation: string = lastNode;

  if (props) {
    Object.keys(props).forEach((key) => {
      const re = new RegExp(`{{${key}}}`, "g");
      const translationReplaced = translation.replace(re, String(props[key]));
      if (process.env.NODE_ENV === "development" && translationReplaced === translation) {
        throw Error(`Translation for "${path}" is missing key "${key}"!`);
      }

      translation = translationReplaced;
    });
  }

  return translation;
};

export const t = (path: string, props?: Record<string, unknown>): h.JSX.Element =>
  // eslint-disable-next-line react/no-danger
  <span dangerouslySetInnerHTML={{ __html: tString(path, props) }} />;
