"use strict";

/* global chrome */

/*
Font selection is in "options.html"

<div class="selection">
  <input type="radio" id="courier-new" name="font" value="Courier New" data-generic="monospace">
  <label for="courier-new" style="font-family:Courier New,monospace;">The quick brown fox jumps over the lazy dog (Courier New)</label>
</div>
*/
var defaultFont = {
  id: "courier-new",
  name: "Courier New",
  genericFamily: "monospace",
  fontFamily: "Courier New,monospace" // fallback is always the generic
};

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({
    // Font is set upon installation of the plugin.
    // The reason: You may visit My Notes, or My Notes Options page
    // in unspecified order. At that point, the font must be set.
    font: defaultFont
  });
});
