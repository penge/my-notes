import { getToken } from "shared/permissions/identity";
import call from "../call";

// Updates the name and/or content of a file in Google Drive
export default async function(fileId: string, body: string): Promise<unknown> {
  const token = await getToken();
  if (!token) {
    return;
  }

  const url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;
  const options = {
    method: "PATCH",
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
