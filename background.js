// background.js (Manifest V3 service worker)
// For this milestone, most logic is in popup.js. This file exists so the
// extension can later support more advanced features if needed.

chrome.runtime.onInstalled.addListener(() => {
  console.log("[Cookie Transparency Dashboard] Extension installed.");
});
