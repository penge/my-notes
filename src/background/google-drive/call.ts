export interface DummyResponse {
  json: () => Promise<undefined>
  text: () => Promise<undefined>
}

// Fetches data from Google Drive API and returns the response
export default async function call(url: string, options: RequestInit): Promise<Response | DummyResponse> {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (e) {
    return {
      json: () => Promise.resolve(undefined),
      text: () => Promise.resolve(undefined),
    };
  }
}
