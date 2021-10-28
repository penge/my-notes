import { h, render, Fragment } from "preact";
import { useState, useEffect } from "preact/hooks";

import __Font from "options/Font";
import __Size from "options/Size";
import __NotesOrder from "options/NotesOrder";
import __Theme from "options/Theme";
import __KeyboardShortcuts from "options/KeyboardShortcuts";
import __Options from "options/Options";
import __Export from "options/Export";
import __Version from "options/Version";

import {
  Os,
  Storage,
  NotesObject,
  NotesOrder,
  RegularFont,
  GoogleFont,
  Theme,
  Sync,
} from "shared/storage/schema";
import { setTheme as setThemeCore } from "themes/set-theme";

const Options = (): h.JSX.Element => {
  const [os, setOs] = useState<Os | undefined>(undefined);
  const [version] = useState<string>(chrome.runtime.getManifest().version);
  const [notesCount, setNotesCount] = useState<number>(0);
  const [notesOrder, setNotesOrder] = useState<NotesOrder>(NotesOrder.Alphabetical);
  const [font, setFont] = useState<RegularFont | GoogleFont | undefined>(undefined);
  const [size, setSize] = useState<number>(0);
  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [customTheme, setCustomTheme] = useState<string>("");
  const [sync, setSync] = useState<Sync | undefined>(undefined);
  const [autoSync, setAutoSync] = useState<boolean>(false);
  const [tab, setTab] = useState<boolean>(false);
  const [tabSize, setTabSize] = useState<number>(-1);

  useEffect(() => {
    chrome.runtime.getPlatformInfo((platformInfo) => setOs(platformInfo.os === "mac" ? "mac" : "other"));

    chrome.storage.local.get([
      // Appearance
      "font",
      "size",
      "theme",
      "customTheme",

      // Notes
      "notes",

      // Options
      "notesOrder",
      "tab",
      "tabSize",
      "autoSync",

      // Sync
      "sync",
    ], items => {
      const local = items as Storage;

      // Appearance
      setFont(local.font);
      setSize(local.size);
      setTheme(local.theme);
      setCustomTheme(local.customTheme);

      // Notes
      setNotesCount(Object.keys(local.notes).length);

      // Options
      setNotesOrder(local.notesOrder);
      setTab(local.tab);
      setTabSize(local.tabSize);
      setAutoSync(local.autoSync);

      // Sync
      setSync(local.sync);
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local") {
        return;
      }

      if (changes["font"]) {
        setFont(changes["font"].newValue);
      }

      if (changes["size"]) {
        setSize(changes["size"].newValue);
      }

      if (changes["theme"]) {
        setTheme(changes["theme"].newValue);
      }

      if (changes["customTheme"]) {
        setCustomTheme(changes["customTheme"].newValue);
      }

      if (changes["notes"]) {
        const newValue: NotesObject = changes["notes"].newValue;
        const newNotesCount = Object.keys(newValue).length;
        setNotesCount(newNotesCount);
      }

      if (changes["notesOrder"]) {
        setNotesOrder(changes["notesOrder"].newValue);
      }

      if (changes["tab"]) {
        setTab(changes["tab"].newValue);
      }

      if (changes["tabSize"]) {
        setTabSize(changes["tabSize"].newValue);
      }

      if (changes["autoSync"]) {
        setAutoSync(changes["autoSync"].newValue);
      }

      if (changes["sync"]) {
        setSync(changes["sync"].newValue);
      }
    });
  }, []);

  useEffect(() => {
    // setThemeCore injects one of:
    // - light.css
    // - dark.css
    // - customTheme string
    theme && setThemeCore(document, { theme, customTheme: customTheme });
  }, [theme, customTheme]);

  return (
    <Fragment>
      <h1>My Notes</h1>

      <__Font font={font} />
      <__Size size={size} />
      <__NotesOrder notesOrder={notesOrder} />
      <__Theme theme={theme} />
      {os && <__KeyboardShortcuts os={os} />}
      <__Options
        sync={sync}
        autoSync={autoSync}
        tab={tab}
        tabSize={tabSize}
      />
      <__Export canExport={notesCount > 0} />
      <__Version version={version} />
    </Fragment>
  );
};

render(<Options />, document.body);
