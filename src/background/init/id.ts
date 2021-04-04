function randomId(): string {
  const randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);
  let hex = "";
  for (let i = 0; i < randomPool.length; i += 1) {
    hex += randomPool[i].toString(16);
  }
  return hex;
}

/**
 * Assigns a random ID to My Notes installation
 *
 * This ID is used by "Save to remotely open My Notes"
 * to save text to remote My Notes only
 */
export const setId = (): void => {
  chrome.storage.local.get(["id"], local => {
    if (local.id) {
      return;
    }
    const id = randomId();
    chrome.storage.local.set({ id: id });
  });
};
