import { havingPermission } from "../permissions";

export default async (): Promise<string> => {
  const allowed = await havingPermission("identity");
  if (!allowed) {
    return "";
  }

  return new Promise((resolve) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      resolve(token);
    });
  });
};
