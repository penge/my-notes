/* global chrome, Promise */

import { havingPermission } from "./index.js";

export const getToken = async () => {
  const allowed = await havingPermission("identity");
  return allowed && new Promise(resolve => {
    chrome.identity.getAuthToken({ interactive: true }, token => {
      resolve(token);
    });
  });
};
