import { h, Fragment } from "preact";
import { useCallback } from "preact/hooks";
import { Sync } from "shared/storage/schema";
import formatDate from "shared/date/format-date";
import { requestPermission, removePermission } from "shared/permissions";
import clsx from "clsx";

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
      <h2>Options</h2>

      {/* "sync" */}
      <div id="sync-selection" class="selection with-comment">
        <input
          type="checkbox"
          checked={Boolean(sync)}
          onClick={togglePermissionRequiredOption("identity")}
        />
        <div>
          <label class="bold">Enable Google Drive Sync</label>
          <div class="comment">
            Creates a folder <b>My Notes</b> (automatically, once) in your Google Drive, and uses it to back up your notes.
            Notes are synchronized to and from Google Drive once the feature is enabled, and then on every click on the <b>Sync now</b> button in the Sidebar.<br /><br />

            <b>Why sync:</b><br />
            <ul>
              <li>Having a backup of your notes (notes can be restored)</li>
              <li>Can edit notes from other sources (Google Drive, My Notes, vice versa)</li>
              <li>Can sync notes and edit them from other computers (by installing My Notes and using the same Google Account)</li>
            </ul>

            <b>Permission:</b><br />
            My Notes can only access the files it created. It cannot see other files in your Google Drive.<br />
            My Notes will request a permission to enable this feature.<br /><br />

            <b>Location: </b>{sync && <a id="sync-folder-location" class="bold" href={sync.folderLocation} target="_blank">{sync.folderLocation}</a>}<br />
            <b>Last sync: </b>{sync && <span id="sync-last-sync" class="bold">{sync.lastSync ? formatDate(sync.lastSync) : "In progress..."}</span>}

            <br /><br />

            <div class={clsx(!sync && "disabled")}>
              <div class="selection">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onClick={toggleOption("autoSync")}
                />
                <label class="bold">Enable Auto Sync</label>
              </div>

              <div>
                Auto Sync will automatically sync your notes to and from Google Drive every time you open My Notes,
                and every 6 seconds if your local notes were updated since the last sync.
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
          <label class="bold">Indent text on <span class="keyboard-shortcut">Tab</span></label>
          <div class="comment">
            <div>
              By default, Tab key changes focus between the address bar and a note. This can be changed to indent the text instead.
            </div>
            <div class={clsx("space-top", !tab && "disabled")}>
              <label>Tab size:</label>
              <select name="tab-size" value={tabSize} onChange={(event) => {
                const newTabSize: number = parseInt((event.target as HTMLSelectElement).value);
                chrome.storage.local.set({ tabSize: newTabSize });
              }}>
                <option value="-1">Tab</option>
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Options;
