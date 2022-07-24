type Handler = (info: chrome.contextMenus.OnClickData) => string;

const getPageUrlHtml = (pageUrl: string) => `<a href="${pageUrl}" target="_blank">${pageUrl}</a>`;

const getUrlToSave: Handler = (info) => {
  const { pageUrl } = info;
  const pageUrlHtml = getPageUrlHtml(pageUrl);
  const toSave = `${pageUrlHtml}<br><br>`;
  return toSave;
};

const getSelectionToSave: Handler = (info) => {
  const { pageUrl, selectionText } = info;
  const pageUrlHtml = getPageUrlHtml(pageUrl);
  const toSave = `${selectionText ?? ""}<br><b>(${pageUrlHtml})</b><br><br>`;
  return toSave;
};

const handlers: Partial<Record<chrome.contextMenus.ContextType, Handler>> = {
  page: getUrlToSave,
  selection: getSelectionToSave,
};

export const getTextToSave = (context: chrome.contextMenus.ContextType, info: chrome.contextMenus.OnClickData): string => {
  const handler = handlers[context];
  if (!handler) {
    return "";
  }

  return handler(info);
};
