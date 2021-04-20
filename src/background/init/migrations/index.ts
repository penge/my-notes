import { Storage } from "shared/storage/schema";
import migrate, { expectedKeys } from "./core";

export const runMigrations = (): void => {
  chrome.storage.sync.get(["newtab", "value", "notes"], sync => {
    chrome.storage.local.get(expectedKeys, local => {
      const items: Storage = migrate(sync, local); // migrate notes and options
      chrome.storage.local.set(items); // store the migrated data

      chrome.storage.sync.remove(["newtab", "value", "notes"]); // no longer needed
    });
  });
};
