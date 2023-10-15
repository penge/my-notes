import { h } from "preact";
import tStringCore from "./t-string";

import en from "./en.json";

export const tString = (path: string, props?: Record<string, unknown>): string =>
  tStringCore(en, path, props);

export const t = (path: string, props?: Record<string, unknown>): h.JSX.Element =>
  // eslint-disable-next-line react/no-danger
  <span dangerouslySetInnerHTML={{ __html: tString(path, props) }} />;
