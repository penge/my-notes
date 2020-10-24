import { getToken } from "shared/permissions/identity";
import call, { DummyResponse } from "../call";

// Deletes a file in Google Drive
export default async function(fileId: string): Promise<Response | DummyResponse | undefined> {
  if (!fileId) {
    return;
  }

  const token = await getToken();
  if (!token) {
    return;
  }

  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const options = {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  };

  const response = await call(url, options);
  return response;
}
