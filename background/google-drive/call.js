/* global fetch, Promise */

// Fetches data from Google Drive API and returns the response
export default async function call(url, options) {
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
