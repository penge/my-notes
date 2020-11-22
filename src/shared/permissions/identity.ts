import { havingPermission } from "./index";

export const getToken = async (): Promise<string> => {
  const allowed = await havingPermission("identity");
  if (!allowed) {
    return "";
  }

  return new Promise(resolve => {
    chrome.identity.getAuthToken({ interactive: true }, token => {
      resolve(token);
    });
  });
};
