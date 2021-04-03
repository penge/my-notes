import { h, Fragment } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Sync, MessageType } from "shared/storage/schema";
import formatDate from "shared/date/format-date";
import { requestPermission, removePermission } from "shared/permissions";
import { sendMessage } from "messages";

interface OptionsProps {
  sync?: Sync
  tab?: boolean
}

const Options = ({ sync, tab }: OptionsProps): h.JSX.Element => {
  return (
    <Fragment>
      <h2>Options</h2>

      {/* "sync" */}
      <div class="selection with-comment">
        <input
          type="checkbox"
          checked={Boolean(sync)}
          onClick={async (event) => {
            const target = (event.target as HTMLInputElement);
            const { checked } = target;
            if (checked) { // request permission on check
              const granted = await requestPermission("identity");
              target.checked = granted;
              if (granted) {
                sendMessage(MessageType.SYNC_INITIATE);
              }
              return;
            }

            await removePermission("identity");
            sendMessage(MessageType.SYNC_STOP);
            target.checked = false;
          }}
        />
        <div>
          <label for="sync" class="bold">Enable Google Drive Sync</label>
          <div class="comment">
            Creates a folder <b>My Notes</b> (automatically, once) in your Google Drive, and uses it to store the notes.
            Notes are synchronized to and from Google Drive once enabled, and then on every click on the <b>Sync now</b> button in the sidebar.<br /><br />

            <b>Benefits:</b><br />
            <ul>
              <li>having a backup of notes (notes can be restored in the future)</li>
              <li>can edit the notes from other sources (Google Drive, My Notes, vice versa)</li>
              <li>can sync the notes and edit them from other computers (by installing My Notes and using the same Google Account)</li>
            </ul>

            My Notes can only access the files it created. It cannot see the other files in your Google Drive.<br />
            My Notes will request permission to enable this feature.<br /><br />

            <b>Location: </b>{sync && <a id="sync-folder-location" class="bold" href={sync.folderLocation} target="_blank">{sync.folderLocation}</a>}<br />
            <b>Last sync: </b>{sync && <span id="sync-last-sync" class="bold">{sync.lastSync ? formatDate(sync.lastSync) : "In progress..."}</span>}
          </div>
        </div>
      </div>

      {/* "tab" */}
      <div class="selection with-comment">
        <input
          type="checkbox"
          checked={tab}
          onClick={(event) => {
            const checked = (event.target as HTMLInputElement).checked;
            chrome.storage.local.set({ tab: checked });
          }}
        />
        <div>
          <label for="tab" class="bold">Indent text on <span class="keyboard-shortcut">Tab</span></label>
          <div class="comment">
            By default, Tab key focuses the address bar. This can be changed to indent the text instead.
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Options;
