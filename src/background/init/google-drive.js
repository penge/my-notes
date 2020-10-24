/* global chrome */

import { sync, syncDeleteFile } from "../google-drive/sync/index.js";

// If My Notes is quickly closed (triggers SYNC) and then open (triggers also SYNC),
// following lock will prevent to run the SYNC twice, if one is pending
let lock = false;

const attach = () => chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "SYNC" && lock === false) {
    lock = true;
    await sync();
    lock = false;
  }

  if (message.type === "SYNC_DELETE_FILE" && message.fileId) {
    await syncDeleteFile(message.fileId);
  }
});

export default {
  attach,
};
