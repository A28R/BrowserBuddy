// background.js - handles security checks with hardcoded percentage option

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
  console.log("Background received message:", request);
  
  if (request.action === "checkSecurity") {
    const securityInfo = analyzeUrl(request.url);
    console.log("Security check result:", securityInfo);
    sendResponse({securityInfo: securityInfo});
    return true; // Indicates we want to send a response asynchronously
  }
  
  return true; // Always return true to indicate you might respond asynchronously
});

// Analyze URL for security risks
function analyzeUrl(url) {
  // HARDCODED PERCENTAGE VALUE - Change this value to set your desired percentage
  const HARDCODED_SECURITY_PERCENTAGE = 94;
  
  let securityLevel = 'safe';
  const details = [];
  
  // Determine security level based on hardcoded value
  if (HARDCODED_SECURITY_PERCENTAGE > 70) {
    securityLevel = 'safe';
  } else if (HARDCODED_SECURITY_PERCENTAGE > 40) {
    securityLevel = 'suspicious';
  } else {
    securityLevel = 'dangerous';
  }
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // We'll still run these checks to display meaningful details
    // but they won't affect the hardcoded percentage
    
    // Check if using HTTPS
    if (urlObj.protocol === 'https:') {
      details.push({
        status: 'safe',
        message: 'Secure connection (HTTPS)'
      });
    } else {
      details.push({
        status: 'warning',
        message: 'Unsecure connection (HTTP)'
      });
    }
    
    // Check for known phishing domains
    if (phishingDomains.includes(domain)) {
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
    
    // Add the hardcoded malware safety percentage
    details.push({
      status: HARDCODED_SECURITY_PERCENTAGE > 70 ? 'safe' : HARDCODED_SECURITY_PERCENTAGE > 40 ? 'warning' : 'danger',
      message: `Malware safety: ${HARDCODED_SECURITY_PERCENTAGE}%`
    });
    
    // Add analysis timestamp
    details.push({
      status: 'safe',
      message: 'Last checked: ' + new Date().toLocaleTimeString()
    });
    
  } catch (error) {
    console.error("Error analyzing URL:", error);
    details.push({
      status: 'warning',
      message: 'Unable to analyze URL properly'
    });
    
    // Even with an error, we'll still show our hardcoded percentage
    details.push({
      status: HARDCODED_SECURITY_PERCENTAGE > 70 ? 'safe' : HARDCODED_SECURITY_PERCENTAGE > 40 ? 'warning' : 'danger',
      message: `Malware safety: ${HARDCODED_SECURITY_PERCENTAGE}%`
    });
  }
  
  return {
    level: securityLevel,
    score: HARDCODED_SECURITY_PERCENTAGE,
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

// Handle other messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);
  // Handle the message
  sendResponse({status: "Received in background"});
  return true; // Keep the message channel open for async responses
});