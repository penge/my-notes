import getAuthToken from "shared/identity/get-auth-token";
import call from "../call";

// Lists files, or folders (depends on the query) in Google Drive
export default async (q: string, fields: string): Promise<unknown | undefined> => {
  const token = await getAuthToken();
  if (!token) {
    return undefined;
  }

  const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const response = await call(url, options);
  const json = await response.json();
  return json;
};
