// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background received message:", message);
    // Handle the message
    sendResponse({status: "Received in background"});
    return true; // Keep the message channel open for async responses
  });