import { getToken } from "../../../shared/permissions/identity.js";
import call from "../call.js";

// Lists files, or folders (depends on the query)
export default async function(q, fields) {
  if (!q || !fields) {
    return;
  }

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
