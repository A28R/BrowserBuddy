document.addEventListener('DOMContentLoaded', function() {
    // Handle increasing text size
    document.getElementById('increaseText').addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "increaseText"});
      });
    });
  
    // Handle decreasing text size
    document.getElementById('decreaseText').addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "decreaseText"});
      });
    });
  
    // Handle high contrast toggle
    document.getElementById('highContrast').addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "toggleHighContrast"});
      });
    });
  
    // Handle page simplification
    document.getElementById('simplifyPage').addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "simplifyPage"});
      });
    });
  
    // Handle read aloud functionality
    document.getElementById('readAloud').addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "readAloud"});
      });
    });
  });
  