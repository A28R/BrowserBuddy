// Add these functions to your popup.js file to handle the security display

function checkPageSecurity() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (!tabs || tabs.length === 0) {
      console.error("No active tab found");
      return;
    }
    
    const currentTab = tabs[0];
    if (!currentTab || !currentTab.url) {
      console.error("No URL found in current tab");
      return;
    }

    const currentUrl = currentTab.url;
    console.log("Checking security for URL:", currentUrl);
    
    // First, update UI to "checking" state
    const securityLevel = document.getElementById('securityLevel');
    const securityStatus = document.getElementById('securityStatus');
    const securityIcon = document.getElementById('securityIcon');
    const securityDetails = document.getElementById('securityDetails');
    
    securityLevel.className = 'security-level level-checking';
    securityStatus.textContent = 'Checking security...';
    securityIcon.className = 'fas fa-spinner fa-spin';
    securityDetails.innerHTML = '';
    
    // Send message to background script to check security
    chrome.runtime.sendMessage(
      {action: "checkSecurity", url: currentUrl}, 
      function(response) {
        console.log("Received security response:", response);
        
        if (response && response.securityInfo) {
          updateSecurityUI(response.securityInfo);
        } else {
          console.error("No valid security response received:", response);
          // If there's no response from background script
          updateSecurityUI({
            level: 'unknown',
            score: 0,
            details: [{
              status: 'warning',
              message: 'Could not check security status. Please try reloading the page.'
            }]
          });
        }
      }
    );
  });
}

function updateSecurityUI(securityInfo) {
  console.log("Updating security UI with:", securityInfo);
  
  const securityLevel = document.getElementById('securityLevel');
  const securityStatus = document.getElementById('securityStatus');
  const securityIcon = document.getElementById('securityIcon');
  const securityDetails = document.getElementById('securityDetails');
  
  securityDetails.innerHTML = '';
  
  // Display the security score percentage
  if (securityInfo.score !== undefined) {
    // Update the width of the security bar to match the percentage
    securityLevel.style.width = securityInfo.score + '%';
    
    // Color based on score
    if (securityInfo.score > 70) {
      securityLevel.style.backgroundColor = '#2ecc71'; // Green
      securityIcon.className = 'fas fa-shield-alt security-safe';
    } else if (securityInfo.score > 40) {
      securityLevel.style.backgroundColor = '#f39c12'; // Orange
      securityIcon.className = 'fas fa-exclamation-triangle security-warning';
    } else {
      securityLevel.style.backgroundColor = '#e74c3c'; // Red
      securityIcon.className = 'fas fa-skull-crossbones security-danger';
    }
    
    // Show percentage in the status text
    securityStatus.textContent = securityInfo.score + '% Safe';
  } else {
    // Set security level class and text (fallback to original behavior)
    switch(securityInfo.level) {
      case 'safe':
        securityLevel.className = 'security-level level-safe';
        securityStatus.textContent = 'Safe';
        securityIcon.className = 'fas fa-shield-alt security-safe';
        break;
      case 'suspicious':
        securityLevel.className = 'security-level level-suspicious';
        securityStatus.textContent = 'Suspicious';
        securityIcon.className = 'fas fa-exclamation-triangle security-warning';
        break;
      case 'dangerous':
        securityLevel.className = 'security-level level-dangerous';
        securityStatus.textContent = 'Dangerous';
        securityIcon.className = 'fas fa-skull-crossbones security-danger';
        break;
      default:
        securityLevel.className = 'security-level level-checking';
        securityStatus.textContent = 'Unknown';
        securityIcon.className = 'fas fa-question-circle';
    }
  }
  
  // Add security details
  securityInfo.details.forEach(detail => {
    const detailItem = document.createElement('div');
    detailItem.className = 'security-item';
    
    const icon = document.createElement('i');
    if (detail.status === 'safe') {
      icon.className = 'fas fa-check-circle security-safe';
    } else if (detail.status === 'warning') {
      icon.className = 'fas fa-exclamation-circle security-warning';
    } else if (detail.status === 'danger') {
      icon.className = 'fas fa-times-circle security-danger';
    }
    
    const text = document.createElement('span');
    text.textContent = detail.message;
    
    detailItem.appendChild(icon);
    detailItem.appendChild(text);
    securityDetails.appendChild(detailItem);
  });
}

// Make sure these functions are called when needed in your popup.js
document.addEventListener('DOMContentLoaded', function() {
  // Your existing event listeners for buttons, etc.
  
  // Call the security check function when popup opens
  console.log("Popup opened, checking page security");
  checkPageSecurity();
});