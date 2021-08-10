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
            <span class="keyboard-shortcut">{shortcut[os]}</span>
            {shortcut.configurable && <span>&nbsp;(open <span class="url">chrome://extensions/shortcuts</span> to configure)</span>}

            {shortcut.description === "Open Command palette" && (
              <div class="comment">
                <div>By default, Command palette looks for notes <b>by their name.</b></div>
                <div>Type <span class="keyboard-shortcut">&gt;</span> first, and continue to start search for <b>commands.</b></div>
                <div>Type <span class="keyboard-shortcut">?</span> first, and continue to start search for notes <b>by their content.</b></div>
              </div>
            )}
          </td>
        </tr>
      )}
    </table>
  </Fragment>
);

export default KeyboardShortcuts;
