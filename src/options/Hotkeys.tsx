import { h, Fragment } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { useState, useEffect } from "preact/hooks";
import hotkeys from "./helpers/hotkeys";

const Hotkeys = (): h.JSX.Element => {
  const [os, setOs] = useState<string>("");

  useEffect(() => {
    chrome.runtime.getPlatformInfo((platformInfo) => {
      const os = platformInfo.os === "mac" ? "mac" : "other";
      setOs(os);
    });
  }, []);

  return (
    <Fragment>
      <h2>Hotkeys</h2>
      <table id="hotkeys">
        {hotkeys.map((hotkey) =>
          <tr>
            <td class="description">{hotkey.description}</td>
            <td>
              {hotkey.configurable && <span>e.g.&nbsp;</span>}
              {hotkey.hold && <span>hold&nbsp;</span>}
              {os === "mac" && <span class="hotkey os-mac">{hotkey.mac}</span>}
              {os === "other" && <span class="hotkey os-other">{hotkey.other}</span>}
              {hotkey.configurable && <span>&nbsp;(open <span class="hotlink">chrome://extensions/shortcuts</span> to configure)</span>}
            </td>
          </tr>
        )}
      </table>
    </Fragment>
  );
};

export default Hotkeys;
