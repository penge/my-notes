import { getToken } from "../../../shared/permissions/identity.js";
import call from "../call.js";

// Deletes the file
export default async function(fileId) {
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
