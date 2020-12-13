import { h, Fragment, render } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { useState, useEffect } from "preact/hooks";

import __Font from "options/Font";
import __Size from "options/Size";
import __Theme from "options/Theme";
import __Hotkeys from "options/Hotkeys";
import __Options from "options/Options";
import __Version from "options/Version";

import {
  RegularFont,
  GoogleFont,
  Theme,
  Sync,
} from "shared/storage/schema";
import setThemeCore from "themes/set-theme";

const Options = () => {
  const [version] = useState<string>(chrome.runtime.getManifest().version);
  const [font, setFont] = useState<RegularFont | GoogleFont | undefined>(undefined);
  const [size, setSize] = useState<number>(0);
  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [customTheme, setCustomTheme] = useState<string>("");
  const [newtab, setNewtab] = useState<boolean>(false);
  const [sync, setSync] = useState<Sync | undefined>(undefined);
  const [tab, setTab] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.local.get([
      "font",
      "size",
      "theme",
      "customTheme",
      "newtab",
      "sync",
      "tab",
    ], local => {
      setFont(local.font);
      setSize(local.size);
      setTheme(local.theme);
      setCustomTheme(local.customTheme);
      setNewtab(local.newtab);
      setSync(local.sync);
      setTab(local.tab);
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

      if (changes["newtab"]) {
        setNewtab(changes["newtab"].newValue);
      }

      if (changes["sync"]) {
        setSync(changes["sync"].newValue);
      }

      if (changes["tab"]) {
        setTab(changes["tab"].newValue);
      }
    });
  }, []);

  useEffect(() => {
    // setThemeCore injects one of:
    // - light.css
    // - dark.css
    // - customTheme string
    theme && setThemeCore({ name: theme, customTheme: customTheme });
  }, [theme, customTheme]);

  return (
    <Fragment>
      <h1>My Notes</h1>

      <__Font font={font} />
      <__Size size={size} />
      <__Theme theme={theme} />
      <__Hotkeys />
      <__Options
        newtab={newtab}
        sync={sync}
        tab={tab}
      />
      <__Version version={version} />
    </Fragment>
  );
};

render(<Options />, document.body);
