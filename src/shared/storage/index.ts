export const getItem = <T>(key: string): Promise<T | undefined> => {
  return new Promise(resolve => {
    chrome.storage.local.get(key, local => {
      resolve(local[key]);
    });
  });
};

export const setItem = <T>(key: string, value: T): Promise<void> => {
  return new Promise(resolve => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve();
    });
  });
};

export const removeItem = (key: string): Promise<void> => {
  return new Promise(resolve => {
    chrome.storage.local.remove(key, () => {
      resolve();
    });
  });
};
