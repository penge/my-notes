export default function useAsClipboard(noteName: string): void {
  chrome.storage.local.set({ clipboard: noteName });
}
