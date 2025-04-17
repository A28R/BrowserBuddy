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

    //reset button
    document.getElementById("resetButton").addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "resetAll" });
      });
    });

    //font
    document.getElementById("fontSelector").addEventListener("change", function() {
      const selectedFont = this.value;
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "changeFont", font: selectedFont });
      });
    });

    // Add this to your popup.js file, inside the DOMContentLoaded event listener

    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
        if (currentTab && currentTab.url) {
          // Send message to background script to analyze the URL
          chrome.runtime.sendMessage(
            { action: "checkSecurity", url: currentTab.url },
            function (response) {
              if (response && response.securityInfo) {
                setSecurityLevel(response.securityInfo.level);
                displaySecurityDetails(response.securityInfo.details);
              } else {
                console.error("No security info received.");
              }
            }
          );
       }
      });


    function setSecurityLevel(level) {
      const levelBar = document.getElementById('securityLevel');
      const statusText = document.getElementById('securityStatus');
      const icon = document.getElementById('securityIcon');
    
      levelBar.className = 'security-level'; // reset class
      icon.className = 'fas fa-shield-alt'; // reset icon
    
      switch(level) {
        case 'safe':
          levelBar.style.width = '100%';
          levelBar.style.backgroundColor = 'green';
          statusText.textContent = 'This page looks safe.';
          break;
        case 'suspicious':
          levelBar.style.width = '60%';
          levelBar.style.backgroundColor = 'orange';
          statusText.textContent = 'This page may be suspicious.';
          icon.classList.add('fa-exclamation-triangle');
          break;
        case 'dangerous':
          levelBar.style.width = '100%';
          levelBar.style.backgroundColor = 'red';
          statusText.textContent = 'Warning: This page is dangerous!';
          icon.classList.add('fa-skull-crossbones');
          break;
        default:
          levelBar.style.width = '0';
          levelBar.style.backgroundColor = 'gray';
          statusText.textContent = 'Security status unknown.';
          break;
      }
    }
    

    // Security check function
    function checkPageSecurity() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentUrl = tabs[0].url;
        
        // First, update UI to "checking" state
        const securityLevel = document.getElementById('securityLevel');
        const securityStatus = document.getElementById('securityStatus');
        const securityIcon = document.getElementById('securityIcon');
        const securityDetails = document.getElementById('securityDetails');
        
        securityLevel.className = 'security-level level-checking';
        securityStatus.textContent = 'Checking security...';
        securityIcon.className = 'fas fa-spinner fa-spin';
        securityDetails.innerHTML = '';
        
        // Update security UI based on results
    function updateSecurityUI(securityInfo) {
      const securityLevel = document.getElementById('securityLevel');
      const securityStatus = document.getElementById('securityStatus');
      const securityIcon = document.getElementById('securityIcon');
      const securityDetails = document.getElementById('securityDetails');
      
      securityDetails.innerHTML = '';
      
      // Set security level class and text
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


        // Send message to background script to check security
        chrome.runtime.sendMessage({action: "checkSecurity", url: currentUrl}, function(response) {
          if (response && response.securityInfo) {
            updateSecurityUI(response.securityInfo);
          } else {
            // If there's no response from background script, use the updateSecurityUI function instead
            updateSecurityUI({
              level: 'unknown',
              details: [{
                status: 'warning',
                message: 'Could not check security status'
              }]
            });
          }
        });
      });
    }

    // Call the security check function when popup opens
    checkPageSecurity()
        
    

  });
  