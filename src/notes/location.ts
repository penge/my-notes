const getParam = (name: string) => new URL(window.location.href).searchParams.get(name);

export const getFocusOverride = (): boolean => getParam("focus") === "";
export const getActiveFromUrl = (): string => getParam("note") || "";
export const isOverview = (): boolean => getParam("overview") === "";
