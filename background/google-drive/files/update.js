import { getToken } from "../../../shared/permissions/identity.js";
import call from "../call.js";

// Updates the name and/or content of a file
export default async function(fileId, body) {
  if (!fileId || !body) {
    return;
  }

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
