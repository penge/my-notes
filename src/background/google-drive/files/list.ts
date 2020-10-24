import { getToken } from "shared/permissions/identity";
import call from "../call";

// Lists files, or folders (depends on the query) in Google Drive
export default async function(q: string, fields: string): Promise<unknown> {
  const token = await getToken();
  if (!token) {
    return;
  }

  const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}`;
  const options = {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  };

  const response = await call(url, options);
  const json = await response.json();
  return json;
}
