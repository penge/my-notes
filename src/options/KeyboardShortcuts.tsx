import { h, Fragment } from "preact";
import { Os } from "shared/storage/schema";
import keyboardShortcuts from "./helpers/keyboard-shortcuts";

interface KeyboardShortcutsProps {
  os: Os
}

const KeyboardShortcuts = ({ os }: KeyboardShortcutsProps): h.JSX.Element => (
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

export default KeyboardShortcuts;
