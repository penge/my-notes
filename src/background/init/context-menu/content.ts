const getPageUrlHtml = (pageUrl: string) => `<a href="${pageUrl}" target="_blank">${pageUrl}</a>`;

export const getUrlToSave = (info: chrome.contextMenus.OnClickData) => {
  const { pageUrl } = info;
  const pageUrlHtml = getPageUrlHtml(pageUrl);
  const toSave = `${pageUrlHtml}<br><br>`;
  return toSave;
};

export const getSelectionToSave = (info: chrome.contextMenus.OnClickData) => {
  const { pageUrl, selectionText } = info;
  const pageUrlHtml = getPageUrlHtml(pageUrl);
  const toSave = `${selectionText}<br><b>(${pageUrlHtml})</b><br><br>`;
  return toSave;
};
