export interface CallResponse {
  ok: boolean
  json: () => Promise<unknown>
  text: () => Promise<string | undefined>
}

const failed: CallResponse = {
  ok: false,
  json: () => Promise.resolve(undefined),
  text: () => Promise.resolve(undefined),
};

// Fetches data from Google Drive API. An error status (e.g. 403 rate limit,
// 503) is treated like a network error, and a body that is not JSON (e.g. an
// HTML error page from Google's frontend) reads as undefined, so neither is
// ever mistaken for a file's content or metadata
export default async function call(url: string, options: RequestInit): Promise<CallResponse> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      return failed;
    }

    return {
      ok: true,
      json: () => response.json().catch(() => undefined),
      text: () => response.text().catch(() => undefined), // e.g. the connection dropped mid-download
    };
  } catch {
    return failed;
  }
}
