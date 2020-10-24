import { getToken } from "../../../shared/permissions/identity.js";
import call from "../call.js";

// Creates a file, or a folder (depends on the body)
export default async function(body) {
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
