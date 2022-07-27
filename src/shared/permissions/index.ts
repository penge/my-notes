export const requestPermission = (permissionName: string): Promise<boolean> => new Promise((resolve) => {
  chrome.permissions.request({ permissions: [permissionName] }, (granted) => {
    resolve(granted);
  });
});

export const withPermission = (permissionName: string) => (callback: () => void): void => {
  requestPermission(permissionName).then((granted) => granted && callback());
};

export const havingPermission = (permissionName: string): Promise<boolean> => new Promise((resolve) => {
  chrome.permissions.contains({ permissions: [permissionName] }, (result) => {
    resolve(result);
  });
});

export const removePermission = (permissionName: string): Promise<boolean> => new Promise((resolve) => {
  chrome.permissions.remove({ permissions: [permissionName] }, (removed) => {
    resolve(removed);
  });
});
