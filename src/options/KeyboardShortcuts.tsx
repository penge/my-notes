import { h, Fragment } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { useState, useEffect } from "preact/hooks";
import keyboardShortcuts from "./helpers/keyboard-shortcuts";

const KeyboardShortcuts = (): h.JSX.Element => {
  const [os, setOs] = useState<string>("");

  useEffect(() => {
    chrome.runtime.getPlatformInfo((platformInfo) => {
      const os = platformInfo.os === "mac" ? "mac" : "other";
      setOs(os);
    });
  }, []);

  return (
    <Fragment>
      <h2>Shortcuts</h2>
      <table id="keyboard-shortcuts">
        {keyboardShortcuts.map((shortcut) =>
          <tr>
            <td class="description">{shortcut.description}</td>
            <td>
              {shortcut.configurable && <span>e.g.&nbsp;</span>}
              {shortcut.hold && <span>hold&nbsp;</span>}
              {os === "mac" && <span class="keyboard-shortcut os-mac">{shortcut.mac}</span>}
              {os === "other" && <span class="keyboard-shortcut os-other">{shortcut.other}</span>}
              {shortcut.configurable && <span>&nbsp;(open <span class="url">chrome://extensions/shortcuts</span> to configure)</span>}
            </td>
          </tr>
        )}
      </table>
    </Fragment>
  );
};

export default KeyboardShortcuts;
