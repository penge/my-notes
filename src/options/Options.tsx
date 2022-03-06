import { h, Fragment } from "preact";
import { useCallback } from "preact/hooks";
import { Sync } from "shared/storage/schema";
import formatDate from "shared/date/format-date";
import { requestPermission, removePermission } from "shared/permissions";
import clsx from "clsx";
import { t } from "i18n";

const D1 = "Options available.Enable Google Drive Sync detail";
const D2 = "Options available.Indent text on Tab detail";

interface OptionsProps {
  sync?: Sync
  autoSync: boolean
  tab: boolean
  tabSize: number
}

const Options = ({ sync, autoSync, tab, tabSize }: OptionsProps): h.JSX.Element => {
  const toggleOption = useCallback((key: string) => (event: h.JSX.TargetedMouseEvent<HTMLInputElement>) => {
    const checked = (event.target as HTMLInputElement).checked;
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
      <div id="sync-selection" class="selection with-comment">
        <input
          type="checkbox"
          checked={Boolean(sync)}
          onClick={togglePermissionRequiredOption("identity")}
        />
        <div>
          <label class="bold">{t("Options available.Enable Google Drive Sync")}</label>
          <div class="comment">
            {t(`${D1}.description`)}
            <br /><br />

            <b>{t(`${D1}.Why sync:`)}</b><br />
            <ul>
              <li>{t(`${D1}.Why sync reasons.reason1`)}</li>
              <li>{t(`${D1}.Why sync reasons.reason2`)}</li>
              <li>{t(`${D1}.Why sync reasons.reason3`)}</li>
            </ul>

            <b>{t(`${D1}.Permission:`)}</b><br />
            {t(`${D1}.Permission details.detail1`)}<br />
            {t(`${D1}.Permission details.detail2`)}<br /><br />

            <b>{t(`${D1}.Location:`)}{" "}</b>{sync && <a id="sync-folder-location" class="bold" href={sync.folderLocation} target="_blank">{sync.folderLocation}</a>}<br />
            <b>{t(`${D1}.Last sync:`)}{" "}</b>{sync && <span id="sync-last-sync" class="bold">{sync.lastSync ? formatDate(sync.lastSync) : "In progress..."}</span>}

            <br /><br />

            <div class={clsx(!sync && "disabled")}>
              <div class="selection">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onClick={toggleOption("autoSync")}
                />
                <label class="bold">{t(`${D1}.Enable Auto Sync`)}</label>
              </div>

              <div>
                {t(`${D1}.Enable Auto Sync description`)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "tab" */}
      <div id="tab-selection" class="selection with-comment">
        <input
          type="checkbox"
          checked={tab}
          onClick={toggleOption("tab")}
        />
        <div>
          <label class="bold">{t("Options available.Indent text on Tab", { Tab: "<span class=\"keyboard-shortcut\">Tab</span>" })}</label>
          <div class="comment">
            <div>
              {t(`${D2}.description`)}
            </div>
            <div class={clsx("space-top", !tab && "disabled")}>
              <label>{t(`${D2}.Tab size:`)}</label>
              <select
                class="select"
                value={tabSize}
                onChange={(event) => {
                  const newTabSize: number = parseInt((event.target as HTMLSelectElement).value);
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
    </Fragment>
  );
};

export default Options;
