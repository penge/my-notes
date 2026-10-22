import getAuthToken from "shared/identity/get-auth-token";
import call from "../call";

// Lists files, or folders (depends on the query) in Google Drive.
// Google Drive returns at most one page per request, so a listing that can
// exceed one page passes `pageSize` and follows `pageToken` from the response.
export default async (q: string, fields: string, pageSize?: number, pageToken?: string): Promise<unknown | undefined> => {
  const token = await getAuthToken();
  if (!token) {
    return undefined;
  }

  const params = new URLSearchParams({ q, fields });
  if (pageSize) {
    params.set("pageSize", String(pageSize));
  }
  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const url = `https://www.googleapis.com/drive/v3/files?${params}`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const response = await call(url, options);
  return response.json();
};
