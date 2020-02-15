import { getToken } from "../../../shared/permissions/identity.js";
import call from "../call.js";

// Returns the content of a file
export default async function(fileId) {
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
