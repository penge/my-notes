import { Log } from "shared/logger";

export const requestPermission = (permissionName: string): Promise<boolean> => {
  return new Promise(resolve => {
    Log(`Permissions - Requesting permission "${permissionName}"`);
    chrome.permissions.request({ permissions: [permissionName] }, granted => {
      resolve(granted);
    });
  });
};

export const withPermission = (permissionName: string) => (callback: () => void): void => {
  requestPermission(permissionName).then((granted) => granted && callback());
};

export const havingPermission = (permissionName: string): Promise<boolean> => {
  return new Promise (resolve => {
    chrome.permissions.contains({ permissions: [permissionName] }, (result) => {
      resolve(result);
    });
  });
};

export const withGrantedPermission = (permissionName: string, callback: () => void): void => {
  havingPermission(permissionName).then((having) => having && callback());
};

export const removePermission = (permissionName: string): Promise<boolean> => {
  return new Promise(resolve => {
    Log(`Permissions - Removing permission "${permissionName}"`);
    chrome.permissions.remove({ permissions: [permissionName] }, removed => {
      resolve(removed);
    });
  });
};
