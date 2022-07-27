import getAuthToken from "shared/identity/get-auth-token";
import call from "../call";

// Creates a file, or a folder (depends on the body) in Google Drive
export default async (body: string): Promise<unknown | undefined> => {
  if (!body) {
    return undefined;
  }

  const token = await getAuthToken();
  if (!token) {
    return undefined;
  }

  const url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "multipart/related; boundary=my-notes",
    },
    body,
  };

  const response = await call(url, options);
  const json = await response.json();
  return json;
};
