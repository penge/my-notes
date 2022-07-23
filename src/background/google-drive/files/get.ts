import getAuthToken from "shared/identity/get-auth-token";
import call from "../call";

// Returns content of a file in Google Drive
export default async (fileId: string): Promise<string | undefined> => {
  if (!fileId) {
    return undefined;
  }

  const token = await getAuthToken();
  if (!token) {
    return undefined;
  }

  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "plain/html",
    },
  };

  const response = await call(url, options);
  const text = await response.text();
  return text;
};
