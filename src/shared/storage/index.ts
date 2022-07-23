export const getItem = <T>(key: string): Promise<T | undefined> => new Promise((resolve) => {
  chrome.storage.local.get(key, (local) => {
    resolve(local[key]);
  });
});

export const setItem = <T>(key: string, value: T): Promise<void> => new Promise((resolve) => {
  chrome.storage.local.set({ [key]: value }, () => {
    resolve();
  });
});

export const setItems = (items: Record<string, unknown>): Promise<void> => new Promise((resolve) => {
  chrome.storage.local.set(items, () => {
    resolve();
  });
});

export const removeItem = (key: string): Promise<void> => new Promise((resolve) => {
  chrome.storage.local.remove(key, () => {
    resolve();
  });
});
