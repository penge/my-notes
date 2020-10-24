import { getToken } from "shared/permissions/identity";
import call from "../call";

// Returns content of a file in Google Drive
export default async function(fileId: string): Promise<string | undefined> {
  if (!fileId) {
    return;
  }

  const token = await getToken();
  if (!token) {
    return;
  }

  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const options = {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "plain/html",
    },
  };

  const response = await call(url, options);
  const text = await response.text();
  return text;
}
