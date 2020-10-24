/* global chrome, Promise */

export const requestPermission = (permissionName) => {
  return new Promise(resolve => {
    chrome.permissions.request({ permissions: [permissionName] }, granted => {
      resolve(granted);
    });
  });
};

export const withPermission = (permissionName) => async (callback) => {
  const granted = await requestPermission(permissionName);
  if (granted) {
    callback();
  }
};

export const havingPermission = (permissionName) => {
  return new Promise (resolve => {
    chrome.permissions.contains({ permissions: [permissionName] }, (result) => {
      resolve(result);
    });
  });
};

export const removePermission = (permissionName) => {
  return new Promise(resolve => {
    chrome.permissions.remove({ permissions: [permissionName] }, removed => {
      if (removed) {
        resolve();
      }
    });
  });
};
