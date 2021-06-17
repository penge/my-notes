import { initiate, sync, syncDeleteFile, stop } from "../google-drive/sync/index";
import { Storage, Message, MessageType } from "shared/storage/schema";
import { withGrantedPermission } from "shared/permissions";
import { Log } from "shared/logger";

const PREFIX = "Google Drive Sync";

export const handleGoogleDriveMessage = (message: Message): void => {
  if (message.type === MessageType.SYNC_INITIATE) {
    initiate().then((initiated) => initiated && sync());
  }

  if (message.type === MessageType.SYNC) {
    sync();
  }

  if (message.type === MessageType.SYNC_DELETE_FILE && message.payload) {
    const fileId = message.payload as string;
    syncDeleteFile(fileId);
  }

  if (message.type === MessageType.SYNC_STOP) {
    stop();
  }
};

export const registerGoogleDriveMessages = (): void => {
  chrome.runtime.onMessage.addListener(handleGoogleDriveMessage);
};

const AUTO_SYNC_ALARM_NAME = "Auto Sync";
const autoSyncOnAlarmListener = (alarm: chrome.alarms.Alarm) => {
  if (alarm.name !== AUTO_SYNC_ALARM_NAME) {
    return;
  }

  chrome.storage.local.get(["sync", "autoSync", "lastEdit"], local => {
    const { sync: syncObj, autoSync, lastEdit } = local as Storage;
    if (!syncObj || !autoSync) { // check if sync or autoSync wasn't meanwhile disabled by the user
      detachGoogleDriveAutoSyncAlarm();
      return;
    }

    if (lastEdit <= (syncObj.lastSync ?? "")) { // lastEdit should be GTE than sync.lastSync
      return; // no need to auto sync
    }

    Log(`${PREFIX} - ${AUTO_SYNC_ALARM_NAME} is going to auto sync notes`);
    sync();
  });
};

const attachGoogleDriveAutoSyncAlarm = (): void => withGrantedPermission("alarms", async () => {
  const existingAlarm = await chrome.alarms.get(AUTO_SYNC_ALARM_NAME);
  if (existingAlarm) {
    return; // AUTO_SYNC_ALARM_NAME is already registered
  }

  chrome.alarms.onAlarm.removeListener(autoSyncOnAlarmListener);
  chrome.alarms.clear(AUTO_SYNC_ALARM_NAME, () => {
    chrome.alarms.onAlarm.addListener(autoSyncOnAlarmListener);
    chrome.alarms.create(AUTO_SYNC_ALARM_NAME, {
      periodInMinutes: 0.1, // Every 6 seconds
    });

    Log(`${PREFIX} - ${AUTO_SYNC_ALARM_NAME} was registered`);
  });
});

const detachGoogleDriveAutoSyncAlarm = (): void => withGrantedPermission("alarms", () => {
  chrome.alarms.onAlarm.removeListener(autoSyncOnAlarmListener);
  chrome.alarms.clear(AUTO_SYNC_ALARM_NAME, (wasCleared) => {
    if (wasCleared) {
      Log(`${PREFIX} - ${AUTO_SYNC_ALARM_NAME} was unregistered`);
    }
  });
});

export const registerGoogleDriveAutoSync = (): void => {
  // Attach alarm once service worker started
  chrome.storage.local.get(["sync", "autoSync"], (local) => {
    if (local.sync && local.autoSync) {
      attachGoogleDriveAutoSyncAlarm();
    }
  });

  // Attach/Detach alarm depending on storage changes
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") {
      return;
    }

    // Interested only in changes of "sync" or "autoSync"
    const interest: chrome.storage.StorageChange[] = [changes["sync"], changes["autoSync"]];
    const matchesInterest: boolean = interest.some((change) => typeof change === "object");
    if (!matchesInterest) {
      return;
    }

    // If "sync" or "autoSync" was disabled, detach the alarm
    const shouldDetachAutoSyncAlarm: boolean = interest.some((change) => change && Boolean(change.newValue) === false);
    if (shouldDetachAutoSyncAlarm) {
      detachGoogleDriveAutoSyncAlarm();
      return;
    }

    // At this point, either "sync" or "autoSync" was enabled, we need to check the other key
    const changedKey = changes["sync"] ? "sync" : "autoSync";
    const otherKey = changedKey === "sync" ? "autoSync" : "sync";

    chrome.storage.local.get(otherKey, (local) => {
      if (!local[otherKey]) {
        detachGoogleDriveAutoSyncAlarm();
      }

      // Both "sync" and "autoSync" are enabled, we can attach the alarm
      attachGoogleDriveAutoSyncAlarm();
    });
  });
};
