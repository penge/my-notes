/* eslint-disable jsx-a11y/label-has-associated-control */
import { h, Fragment } from "preact";
import { useCallback } from "preact/hooks";
import { Os, Sync, StorageKey } from "shared/storage/schema";
import formatDate from "shared/date/format-date";
import { requestPermission, removePermission } from "shared/permissions";
import clsx from "clsx";
import { t } from "i18n";
import keyboardShortcuts from "./helpers/keyboard-shortcuts";

const D1 = "Options available.Enable Google Drive Sync detail";
const D2 = "Options available.Indent text on Tab detail";

interface OptionsProps {
  os: Os
  sync?: Sync
  autoSync: boolean
  tab: boolean
  tabSize: number
  openNoteOnMouseHover: boolean
}

const Options = ({
  os, sync, autoSync, tab, tabSize, openNoteOnMouseHover,
}: OptionsProps): h.JSX.Element => {
  const openNoteOnMouseHoverKeyboardShortcut = keyboardShortcuts.find((item) => item.description === "Open note on mouse hover");
  const openNoteOnMouseHoverKey = openNoteOnMouseHoverKeyboardShortcut && openNoteOnMouseHoverKeyboardShortcut[os];

  const toggleOption = useCallback((key: StorageKey) => (event: h.JSX.TargetedMouseEvent<HTMLInputElement>) => {
    const { checked } = event.target as HTMLInputElement;
    chrome.storage.local.set({ [key]: checked });
  }, []);

  const togglePermissionRequiredOption = useCallback((permission: string) => (event: h.JSX.TargetedMouseEvent<HTMLInputElement>) => {
    if ((event.target as HTMLInputElement).checked) { // request permission on check
      requestPermission(permission);
      return;
    }

    removePermission(permission);
  }, []);

  return (
    <Fragment>
      <h2>{t("Options")}</h2>

      {/* "sync" */}
      <div id="sync-selection" className="selection with-comment">
        <input
          type="checkbox"
          checked={Boolean(sync)}
          onClick={togglePermissionRequiredOption("identity")}
        />
        <div>
          <label className="bold">
            {t("Options available.Enable Google Drive Sync")}
          </label>
          <div className="comment">
            {t(`${D1}.description`)}
            <br />
            <br />

            <b>{t(`${D1}.Why sync:`)}</b>
            <br />
            <ul>
              <li>{t(`${D1}.Why sync reasons.reason1`)}</li>
              <li>{t(`${D1}.Why sync reasons.reason2`)}</li>
              <li>{t(`${D1}.Why sync reasons.reason3`)}</li>
            </ul>

            <b>{t(`${D1}.Permission:`)}</b>
            <br />
            {t(`${D1}.Permission details.detail1`)}
            <br />
            {t(`${D1}.Permission details.detail2`)}
            <br />
            <br />

            <b>
              {t(`${D1}.Location:`)}
              {" "}
            </b>
            {sync && (
              <a id="sync-folder-location" className="bold" href={sync.folderLocation} target="_blank" rel="noreferrer">
                {sync.folderLocation}
              </a>
            )}
            <br />

            <b>
              {t(`${D1}.Last sync:`)}
              {" "}
            </b>
            {sync && (
              <span id="sync-last-sync" className="bold">{sync.lastSync ? formatDate(sync.lastSync) : "In progress..."}</span>
            )}

            <br />
            <br />

            <div className={clsx(!sync && "disabled")}>
              <div className="selection">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onClick={toggleOption("autoSync")}
                />
                <label className="bold">
                  {t(`${D1}.Enable Auto Sync`)}
                </label>
              </div>

              <div>
                {t(`${D1}.Enable Auto Sync description`)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "tab" */}
      <div id="tab-selection" className="selection with-comment">
        <input
          type="checkbox"
          checked={tab}
          onClick={toggleOption("tab")}
        />
        <div>
          <label className="bold">{t("Options available.Indent text on Tab", { Tab: "<span class=\"keyboard-shortcut\">Tab</span>" })}</label>
          <div className="comment">
            <div>
              {t(`${D2}.description`)}
            </div>
            <div className={clsx("space-top", !tab && "disabled")}>
              <label>{t(`${D2}.Tab size:`)}</label>
              <select
                className="select"
                value={tabSize}
                onChange={(event) => {
                  const newTabSize: number = parseInt((event.target as HTMLSelectElement).value, 10);
                  chrome.storage.local.set({ tabSize: newTabSize });
                }}
              >
                <option value="-1">{t(`${D2}.Tab`)}</option>
                <option value="2">{t(`${D2}.2 spaces`)}</option>
                <option value="4">{t(`${D2}.4 spaces`)}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* "openNoteOnMouseHover" */}
      {openNoteOnMouseHoverKey && (
        <div id="open-note-on-mouse-hover-selection" className="selection with-comment">
          <input
            type="checkbox"
            checked={openNoteOnMouseHover}
            onClick={toggleOption("openNoteOnMouseHover")}
          />
          <div>
            <label className="bold">
              {t("Options available.Open note on mouse hover", {
                key: `<span class="keyboard-shortcut">${openNoteOnMouseHoverKey}</span>`,
              })}
            </label>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Options;
