import { h, Fragment } from "preact";
import { Os } from "shared/storage/schema";
import keyboardShortcuts from "./helpers/keyboard-shortcuts";
import { t, tString } from "i18n";

interface KeyboardShortcutsProps {
  os: Os
}

const KeyboardShortcuts = ({ os }: KeyboardShortcutsProps): h.JSX.Element => (
  <Fragment>
    <h2>{t("Shortcuts")}</h2>
    <table id="keyboard-shortcuts">
      {keyboardShortcuts.map((shortcut) =>
        <tr>
          <td class="description">{t(`Shortcuts descriptions.${shortcut.description}`)}</td>
          <td>
            {shortcut.configurable && <span>{tString("Shortcuts other.example given")}{" "}</span>}
            {shortcut.hold && <span>{tString("Shortcuts other.hold")}{" "}</span>}
            <span class="keyboard-shortcut">{shortcut[os]}</span>
            {shortcut.configurable && (
              <span>{" "}{t("Shortcuts other.open to configure", { shortcuts: "<span class=\"url\">chrome://extensions/shortcuts</span>" })}</span>
            )}

            {shortcut.description === "Open Command palette" && (
              <div class="comment">
                <div>{t("Shortcuts descriptions.Open Command palette detail.line1")}</div>
                <div>{t("Shortcuts descriptions.Open Command palette detail.line2", { symbol: "<span class=\"keyboard-shortcut\">&gt;</span>" })}</div>
                <div>{t("Shortcuts descriptions.Open Command palette detail.line3", { symbol: "<span class=\"keyboard-shortcut\">?</span>" })}</div>
              </div>
            )}
          </td>
        </tr>
      )}
    </table>
  </Fragment>
);

export default KeyboardShortcuts;
