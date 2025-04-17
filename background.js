// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background received message:", message);
    // Handle the message
    sendResponse({status: "Received in background"});
    return true; // Keep the message channel open for async responses
  });

// background.js - Add this file to your extension
// This script runs in the background to handle security checks

// List of known phishing domains (this would be more extensive in a real extension)
const phishingDomains = [
  'phishing-example.com',
  'login-secure-fake.com',
  'banking-secure-verify.com'
];

// Suspicious keywords in URLs
const suspiciousKeywords = [
  'login', 'verify', 'secure', 'account', 'password', 'bank', 
  'paypal', 'signin', 'security', 'confirm'
];

// Listen for security check requests
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "checkSecurity") {
    const securityInfo = analyzeUrl(request.url);
    sendResponse({securityInfo: securityInfo});
    return true; // Indicates we want to send a response asynchronously
  }
});

// Analyze URL for security risks
function analyzeUrl(url) {
  let securityLevel = 'safe';
  const details = [];
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Check if using HTTPS
    if (urlObj.protocol === 'https:') {
      details.push({
        status: 'safe',
        message: 'Secure connection (HTTPS)'
      });
    } else {
      securityLevel = 'suspicious';
      details.push({
        status: 'warning',
        message: 'Unsecure connection (HTTP)'
      });
    }
    
    // Check for known phishing domains
    if (phishingDomains.includes(domain)) {
      securityLevel = 'dangerous';
      details.push({
        status: 'danger',
        message: 'Known phishing website'
      });
    } else {
      details.push({
        status: 'safe',
        message: 'Domain not on blacklist'
      });
    }
    
    // Check for too many subdomains (can be suspicious)
    const subdomainCount = domain.split('.').length - 1;
    if (subdomainCount > 3) {
      if (securityLevel === 'safe') securityLevel = 'suspicious';
      details.push({
        status: 'warning',
        message: 'Unusual number of subdomains'
      });
    }
    
    // Check for suspicious keywords in URL
    let keywordMatches = 0;
    suspiciousKeywords.forEach(keyword => {
      if (url.toLowerCase().includes(keyword)) {
        keywordMatches++;
      }
    });
    
    if (keywordMatches >= 3) {
      if (securityLevel === 'safe') securityLevel = 'suspicious';
      details.push({
        status: 'warning',
        message: 'URL contains multiple suspicious keywords'
      });
    }
    
    // Check for unusual TLD (top-level domain)
    const tld = domain.split('.').pop();
    const commonTlds = ['com', 'org', 'net', 'edu', 'gov', 'io', 'co'];
    if (!commonTlds.includes(tld)) {
      if (securityLevel === 'safe') securityLevel = 'suspicious';
      details.push({
        status: 'warning',
        message: 'Unusual domain extension'
      });
    }
    
    // Add analysis timestamp
    details.push({
      status: 'safe',
      message: 'Last checked: ' + new Date().toLocaleTimeString()
    });
    
  } catch (error) {
    // If URL parsing fails
    securityLevel = 'suspicious';
    details.push({
      status: 'warning',
      message: 'Unable to analyze URL properly'
    });
  }
  
  return {
    level: securityLevel,
    details: details
  };
}

// Optional: Check for malicious content when page loads
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url) {
    // Could implement additional checks here that require the page to be loaded
    // like scanning for malicious scripts, iframes, etc.
  }
});