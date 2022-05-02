export const getFocusOverride = (): boolean => new URL(window.location.href).searchParams.get("focus") === "";
export const getActiveFromUrl = (): string => new URL(window.location.href).searchParams.get("note") || ""; // Bookmark
