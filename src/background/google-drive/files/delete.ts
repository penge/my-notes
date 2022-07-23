import getAuthToken from "shared/identity/get-auth-token";
import call, { DummyResponse } from "../call";

// Deletes a file in Google Drive
export default async (fileId: string): Promise<Response | DummyResponse | undefined> => {
  if (!fileId) {
    return undefined;
  }

  const token = await getAuthToken();
  if (!token) {
    return undefined;
  }

  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  const response = await call(url, options);
  return response;
};
