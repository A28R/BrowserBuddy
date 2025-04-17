let currentTextSize = 100; // percentage
let highContrastEnabled = false;
let originalPageState = null;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch(request.action) {
    case "increaseText":
      increaseTextSize();
      break;
    case "decreaseText":
      decreaseTextSize();
      break;
    case "toggleHighContrast":
      toggleHighContrast();
      break;
    case "simplifyPage":
      simplifyPage();
      break;
    case "readAloud":
      readPageAloud();
      break;
    case "resetAll":
      resetAllFeatures();
      break;
    case "changeFont":
      changeFont(request.font);
      break;
  
  }
});

// Increase text size function
function increaseTextSize() {
  currentTextSize += 10;
  document.body.style.fontSize = currentTextSize + "%";
  saveUserPreferences();
}

// Decrease text size function
function decreaseTextSize() {
  if (currentTextSize > 70) {
    currentTextSize -= 10;
    document.body.style.fontSize = currentTextSize + "%";
    saveUserPreferences();
  }
}

// Toggle high contrast mode
function toggleHighContrast() {
  highContrastEnabled = !highContrastEnabled;
  
  if (highContrastEnabled) {
    document.body.classList.add('high-contrast');
  } else {
    document.body.classList.remove('high-contrast');
  }
  
  saveUserPreferences();
}

// Simplify the page by hiding non-essential elements
function simplifyPage() {
  if (!originalPageState) {
    // Store original page state before modifications
    originalPageState = document.body.innerHTML;
    
    // Hide ads, sidebars, and other non-essential content
    const nonEssentialElements = [
      'aside', 'nav', '.sidebar', '.advertisement', '.ads', 
      '.social-media', '.related-content', '.comments'
    ];
    
    nonEssentialElements.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.display = 'none';
      });
    });
    
    // Focus on the main content
    const mainContent = document.querySelector('main, article, .content, #content');
    if (mainContent) {
      document.body.innerHTML = '';
      document.body.appendChild(mainContent.cloneNode(true));
      document.body.style.width = '80%';
      document.body.style.margin = '0 auto';
      document.body.style.lineHeight = '1.6';
    }
  } else {
    // Restore original page
    document.body.innerHTML = originalPageState;
    originalPageState = null;
  }
}

// Read the page content aloud
function readPageAloud() {
  // Get main content or selected text
  let textToRead = '';
  
  if (window.getSelection && window.getSelection().toString()) {
    textToRead = window.getSelection().toString();
  } else {
    // If no text is selected, get the main content
    const mainContent = document.querySelector('main, article, .content, #content');
    if (mainContent) {
      textToRead = mainContent.textContent;
    } else {
      textToRead = document.body.textContent;
    }
  }
  
  // Use the Web Speech API
  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.rate = 0.9; // Slightly slower rate for seniors
  utterance.pitch = 1.0;
  window.speechSynthesis.cancel(); // Stop any current speech
  window.speechSynthesis.speak(utterance);
}

// Save user preferences to chrome storage
function saveUserPreferences() {
  chrome.storage.local.set({
    'textSize': currentTextSize,
    'highContrast': highContrastEnabled
  });
}

// Load user preferences when the page loads
function loadUserPreferences() {
  chrome.storage.local.get(['textSize', 'highContrast'], function(result) {
    if (result.textSize) {
      currentTextSize = result.textSize;
      document.body.style.fontSize = currentTextSize + "%";
    }
    
    if (result.highContrast) {
      highContrastEnabled = result.highContrast;
      if (highContrastEnabled) {
        document.body.classList.add('high-contrast');
      }
    }
  });
}

// Initialize when the content script loads
loadUserPreferences();

// Add necessary styles for high contrast mode
const style = document.createElement('style');
style.textContent = `
  .high-contrast {
    background-color: black !important;
    color: white !important;
  }
  
  .high-contrast a {
    color: yellow !important;
  }
  
  .high-contrast button {
    background-color: white !important;
    color: black !important;
    border: 2px solid yellow !important;
  }
`;

//reset button
function resetAllFeatures() {
  // Reset font size
  currentTextSize = 100;
  document.body.style.fontSize = "";

  // Disable high contrast
  highContrastEnabled = false;
  document.body.classList.remove('high-contrast');

  // Stop any speech
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  // Restore simplified page if modified
  if (originalPageState) {
    document.body.innerHTML = originalPageState;
    originalPageState = null;
  }

  // Clear stored preferences
  chrome.storage.local.remove(['textSize', 'highContrast']);


   // Reset font
   document.body.style.fontFamily = "";

   // Remove any added dyslexic font stylesheet
   const odFont = document.getElementById("odFontLink");
   if (odFont) {
     odFont.remove();
   }
 
   // Clear storage (removes saved font, size, contrast settings)
   chrome.storage.local.remove(['textSize', 'highContrast', 'fontPreference']);
}


function loadOpenDyslexicFont() {
  if (!document.getElementById("odFontLink")) {
    const link = document.createElement("link");
    link.id = "odFontLink";
    link.rel = "stylesheet";
    // Use the extension's local resource instead of external URL
    link.href = chrome.runtime.getURL("fonts/open-dyslexic-regular.css");
    document.head.appendChild(link);
  }
}




//font
function changeFont(font) {
  let fontFamily = "";

  switch (font) {
    case "opendyslexic":
      fontFamily = "'OpenDyslexic', sans-serif";
      loadOpenDyslexicFont(); // load if not yet loaded
      break;
    case "arial":
      fontFamily = "Arial, sans-serif";
      break;
    case "verdana":
      fontFamily = "Verdana, sans-serif";
      break;
    case "sans-serif":
      fontFamily = "sans-serif";
      break;
    case "default":
    default:
      fontFamily = "";
      break;
  }

  document.body.style.fontFamily = fontFamily;

  // Save it to preferences
  chrome.storage.local.set({ fontPreference: font });
}


chrome.storage.local.get(['textSize', 'highContrast', 'fontPreference'], function(result) {
  if (result.textSize) {
    currentTextSize = result.textSize;
    document.body.style.fontSize = currentTextSize + "%";
  }

  if (result.highContrast) {
    highContrastEnabled = result.highContrast;
    if (highContrastEnabled) {
      document.body.classList.add('high-contrast');
    }
  }

  if (result.fontPreference) {
    changeFont(result.fontPreference);
  }
});



document.head.appendChild(style);

