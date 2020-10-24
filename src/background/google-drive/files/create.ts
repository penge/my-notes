import { getToken } from "shared/permissions/identity";
import call from "../call";

// Creates a file, or a folder (depends on the body) in Google Drive
export default async function(body: string): Promise<unknown> {
  if (!body) {
    return;
  }

  const token = await getToken();
  if (!token) {
    return;
  }

  const url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "multipart/related; boundary=my-notes",
    },
    body: body,
  };

  const response = await call(url, options);
  const json = await response.json();
  return json;
}
