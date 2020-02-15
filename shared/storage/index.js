/* global Promise, chrome */

export const getItem = (key) => {
  return new Promise(resolve => {
    chrome.storage.local.get(key, local => {
      resolve(local[key]);
    });
  });
};

export const setItem = (key, value) => {
  return new Promise(resolve => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve();
    });
  });
};

export const removeItem = (key) => {
  return new Promise(resolve => {
    chrome.storage.local.remove(key, () => {
      resolve();
    });
  });
};
