/* global document, fetch, console */

const iframes = document.getElementsByTagName("iframe");
for (const iframe of iframes) {
  // silence console.log (for detailed logs, open the test file)
  iframe.contentWindow.console.log = function() {};

  // Check if the test file exists
  fetch(iframe.src, { method: "HEAD" })
    .then(() => { console.log(`Running ${iframe.src}`); })
    .catch(() => { /* Chrome will print net::ERR_FILE_NOT_FOUND */ });
}
