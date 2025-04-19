// popup.js - Complete rewrite with proper error handling and consistent styling

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, initializing popup");
  initializeUI();
});

function initializeUI() {
  // Set up security UI first
  initializeSecurityUI();
  
  // Set up button event listeners
  setupEventListeners();
}

function initializeSecurityUI() {
  const securityElements = {
    level: document.getElementById('securityLevel'),
    status: document.getElementById('securityStatus'),
    icon: document.getElementById('securityIcon'),
    details: document.getElementById('securityDetails')
  };
  
  // Check if all elements exist
  if (!securityElements.level || !securityElements.status || 
      !securityElements.icon || !securityElements.details) {
    console.error("Security UI elements not found", securityElements);
    return;
  }
  
  // Set initial state
  securityElements.level.className = 'security-level level-checking';
  securityElements.status.textContent = 'Checking security...';
  securityElements.icon.className = 'fas fa-spinner fa-spin';
  securityElements.details.innerHTML = '';
  
  // Start security check
  checkPageSecurity();
}

function setupEventListeners() {
  // Text size controls
  const increaseTextBtn = document.getElementById('increaseText');
  const decreaseTextBtn = document.getElementById('decreaseText');
  
  if (increaseTextBtn) {
    increaseTextBtn.addEventListener('click', function() {
      sendMessageToActiveTab({action: "increaseText"});
    });
  }
  
  if (decreaseTextBtn) {
    decreaseTextBtn.addEventListener('click', function() {
      sendMessageToActiveTab({action: "decreaseText"});
    });
  }
  
  // High contrast button
  const highContrastBtn = document.getElementById('highContrast');
  if (highContrastBtn) {
    highContrastBtn.addEventListener('click', function() {
      sendMessageToActiveTab({action: "toggleHighContrast"});
    });
  }
  
  // Simplify page button
  const simplifyPageBtn = document.getElementById('simplifyPage');
  if (simplifyPageBtn) {
    simplifyPageBtn.addEventListener('click', function() {
      sendMessageToActiveTab({action: "simplifyPage"});
    });
  }
  
  // Read aloud button
  const readAloudBtn = document.getElementById('readAloud');
  if (readAloudBtn) {
    readAloudBtn.addEventListener('click', function() {
      sendMessageToActiveTab({action: "readAloud"});
    });
  }
  
  // Reset button
  const resetBtn = document.getElementById('resetButton');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      sendMessageToActiveTab({action: "resetAll"});
    });
  }
  
  // Font selector
  const fontSelector = document.getElementById('fontSelector');
  if (fontSelector) {
    fontSelector.addEventListener('change', function() {
      sendMessageToActiveTab({
        action: "changeFont", 
        font: this.value
      });
    });
  }
}

function sendMessageToActiveTab(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs && tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
        if (chrome.runtime.lastError) {
          console.warn("Error sending message:", chrome.runtime.lastError.message);
        }
      });
    } else {
      console.error("No active tab found");
    }
  });
}

function checkPageSecurity() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (!tabs || tabs.length === 0) {
      console.error("No active tab found");
      updateSecurityUIWithError("No active tab found");
      return;
    }
    
    const currentTab = tabs[0];
    if (!currentTab || !currentTab.url) {
      console.error("No URL found in current tab");
      updateSecurityUIWithError("No URL found in current tab");
      return;
    }

    const currentUrl = currentTab.url;
    console.log("Checking security for URL:", currentUrl);
    
    // Send message to background script to check security
    chrome.runtime.sendMessage(
      {action: "checkSecurity", url: currentUrl}, 
      function(response) {
        if (chrome.runtime.lastError) {
          console.error("Error getting security info:", chrome.runtime.lastError.message);
          updateSecurityUIWithError("Failed to get security information");
          return;
        }
        
        console.log("Received security response:", response);
        
        if (response && response.securityInfo) {
          updateSecurityUI(response.securityInfo);
        } else {
          console.error("No valid security response received:", response);
          updateSecurityUIWithError("Invalid security response");
        }
      }
    );
  });
}

function updateSecurityUIWithError(errorMessage) {
  const securityElements = {
    level: document.getElementById('securityLevel'),
    status: document.getElementById('securityStatus'),
    icon: document.getElementById('securityIcon'),
    details: document.getElementById('securityDetails')
  };
  
  if (!securityElements.level || !securityElements.status || 
      !securityElements.icon || !securityElements.details) {
    console.error("Security UI elements not found");
    return;
  }
  
  // Reset any existing styles
  securityElements.level.className = 'security-level level-checking';
  securityElements.status.textContent = 'Error';
  securityElements.icon.className = 'fas fa-exclamation-circle security-warning';
  
  // Add error message to details
  securityElements.details.innerHTML = '';
  const detailItem = document.createElement('div');
  detailItem.className = 'security-item';
  
  const icon = document.createElement('i');
  icon.className = 'fas fa-exclamation-circle security-warning';
  
  const text = document.createElement('span');
  text.textContent = errorMessage || 'Could not check security status. Please try reloading the page.';
  
  detailItem.appendChild(icon);
  detailItem.appendChild(text);
  securityElements.details.appendChild(detailItem);
}

function updateSecurityUI(securityInfo) {
  console.log("Updating security UI with:", securityInfo);
  
  const securityElements = {
    level: document.getElementById('securityLevel'),
    status: document.getElementById('securityStatus'),
    icon: document.getElementById('securityIcon'),
    details: document.getElementById('securityDetails')
  };
  
  if (!securityElements.level || !securityElements.status || 
      !securityElements.icon || !securityElements.details) {
    console.error("Security UI elements not found");
    return;
  }
  
  securityElements.details.innerHTML = '';
  
  // Display the security score percentage
  if (securityInfo.score !== undefined) {
    // Use consistent styling approach - just set style properties directly
    securityElements.level.className = 'security-level';
    securityElements.level.style.width = securityInfo.score + '%';
    
    // Color based on score
    if (securityInfo.score > 70) {
      securityElements.level.style.backgroundColor = 'var(--success)';
      securityElements.icon.className = 'fas fa-shield-alt security-safe';
      securityElements.status.textContent = securityInfo.score + '% Safe';
    } else if (securityInfo.score > 40) {
      securityElements.level.style.backgroundColor = 'var(--warning)';
      securityElements.icon.className = 'fas fa-exclamation-triangle security-warning';
      securityElements.status.textContent = securityInfo.score + '% Caution';
    } else {
      securityElements.level.style.backgroundColor = 'var(--error)';
      securityElements.icon.className = 'fas fa-skull-crossbones security-danger';
      securityElements.status.textContent = securityInfo.score + '% Warning';
    }
  } else {
    // Use class-based approach
    securityElements.level.style.width = '';
    securityElements.level.style.backgroundColor = '';
    
    switch(securityInfo.level) {
      case 'safe':
        securityElements.level.className = 'security-level level-safe';
        securityElements.status.textContent = 'Safe';
        securityElements.icon.className = 'fas fa-shield-alt security-safe';
        break;
      case 'suspicious':
        securityElements.level.className = 'security-level level-suspicious';
        securityElements.status.textContent = 'Suspicious';
        securityElements.icon.className = 'fas fa-exclamation-triangle security-warning';
        break;
      case 'dangerous':
        securityElements.level.className = 'security-level level-dangerous';
        securityElements.status.textContent = 'Dangerous';
        securityElements.icon.className = 'fas fa-skull-crossbones security-danger';
        break;
      default:
        securityElements.level.className = 'security-level level-checking';
        securityElements.status.textContent = 'Unknown';
        securityElements.icon.className = 'fas fa-question-circle';
    }
  }
  
  // Add security details
  if (securityInfo.details && Array.isArray(securityInfo.details)) {
    securityInfo.details.forEach(detail => {
      if (!detail || typeof detail !== 'object') return;
      
      const detailItem = document.createElement('div');
      detailItem.className = 'security-item';
      
      const icon = document.createElement('i');
      switch (detail.status) {
        case 'safe':
          icon.className = 'fas fa-check-circle security-safe';
          break;
        case 'warning':
          icon.className = 'fas fa-exclamation-circle security-warning';
          break;
        case 'danger':
          icon.className = 'fas fa-times-circle security-danger';
          break;
        default:
          icon.className = 'fas fa-info-circle';
      }
      
      const text = document.createElement('span');
      text.textContent = detail.message || '';
      
      detailItem.appendChild(icon);
      detailItem.appendChild(text);
      securityElements.details.appendChild(detailItem);
    });
  } else {
    // If no details provided, add a default message
    const detailItem = document.createElement('div');
    detailItem.className = 'security-item';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-info-circle';
    
    const text = document.createElement('span');
    text.textContent = 'No additional security details available.';
    
    detailItem.appendChild(icon);
    detailItem.appendChild(text);
    securityElements.details.appendChild(detailItem);
  }
}