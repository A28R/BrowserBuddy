// security-detection.js - Add this new file to your extension

/**
 * Analyzes the current webpage for phishing indicators
 * This is a basic implementation that should be enhanced with actual security checks
 * @returns {Promise<number>} Risk percentage (0-100)
 */
async function detectPhishingRisk() {
    // In a real implementation, this would analyze:
    // - Domain age and reputation
    // - SSL certificate status
    // - Presence of suspicious forms
    // - Similarity to known brands
    // - Unusual redirects or JavaScript
    // - Known phishing signatures
    
    try {
      const url = window.location.href;
      const domain = new URL(url).hostname;
      
      // Demo logic - replace with actual API calls to security services
      let riskScore = 0;
      
      // Example checks (simplified for demonstration):
      
      // Check 1: Suspicious URL patterns
      const suspiciousTerms = ['secure', 'account', 'login', 'verify', 'banking', 'update'];
      const suspiciousInUrl = suspiciousTerms.some(term => url.toLowerCase().includes(term));
      if (suspiciousInUrl) riskScore += 10;
      
      // Check 2: Domain age simulation (would use WHOIS API in production)
      // For demo, we'll randomly assign "new domains" to some sites
      const isNewDomain = Math.random() < 0.2; // 20% chance
      if (isNewDomain) riskScore += 15;
      
      // Check 3: Presence of login forms
      const hasLoginForm = document.querySelectorAll('input[type="password"]').length > 0;
      if (hasLoginForm) riskScore += 5;
      
      // Check 4: Domain length (very long domains can be suspicious)
      if (domain.length > 30) riskScore += 10;
      
      // Check 5: Check for excessive subdomains
      const subdomainCount = domain.split('.').length - 2;
      if (subdomainCount > 2) riskScore += 10;
      
      // Final adjustments based on known safe domains
      const knownSafeDomains = ['google.com', 'amazon.com', 'facebook.com', 'microsoft.com', 'apple.com', 
                                'youtube.com', 'wikipedia.org', 'twitter.com', 'instagram.com', 'linkedin.com'];
      
      if (knownSafeDomains.some(safe => domain.includes(safe))) {
        riskScore = Math.max(0, riskScore - 20); // Reduce score for known domains
      }
      
      // Cap at 0-100 range
      return Math.min(100, Math.max(0, riskScore));
    } catch (error) {
      console.error("Error detecting phishing risk:", error);
      return 15; // Default moderate-low risk on error
    }
  }
  
  /**
   * Detects likelihood of AI-generated content on the page
   * @returns {Promise<number>} Percentage likelihood (0-100)
   */
  async function detectAIContent() {
    // In a real implementation, this would:
    // - Analyze text patterns typical of AI generation
    // - Look for statistical anomalies in language
    // - Check for repetitive structures or phrases
    // - Use machine learning models trained on AI vs human content
    
    try {
      // Extract page content text
      const pageText = document.body.innerText;
      
      // Skip analysis if very little text
      if (pageText.length < 100) return 10;
      
      // Demo logic - replace with actual AI content detection algorithms
      let aiScore = 0;
      
      // Check 1: Text length and structure
      const paragraphs = pageText.split(/\n\s*\n/);
      const avgParaLength = paragraphs.reduce((sum, p) => sum + p.length, 0) / paragraphs.length;
      
      // Very uniform paragraph lengths can suggest AI generation
      const paraLengths = paragraphs.map(p => p.length);
      const stdDev = calculateStandardDeviation(paraLengths);
      const uniformityScore = 100 - (stdDev / avgParaLength * 100);
      
      if (uniformityScore > 70) aiScore += 15;
      
      // Check 2: Common AI phrasings
      const aiPhrases = [
        'as an ai', 'as an artificial intelligence', 'as a language model', 
        'i cannot', 'i do not have', 'personal opinion', 'my training',
        'it is important to note', 'it\'s worth mentioning'
      ];
      
      const phraseMatches = aiPhrases.filter(phrase => 
        pageText.toLowerCase().includes(phrase)).length;
      
      aiScore += phraseMatches * 10;
      
      // Check 3: Content type analysis
      // Technical/reference content is more likely to be AI generated
      const technicalTerms = ['furthermore', 'however', 'consequently', 'in conclusion', 
                              'research shows', 'studies indicate', 'according to'];
      
      const technicalMatches = technicalTerms.filter(term => 
        pageText.toLowerCase().includes(term)).length;
      
      aiScore += technicalMatches * 3;
      
      // Check 4: Repetitive phrases
      const repetitionScore = detectRepetitivePatterns(pageText);
      aiScore += repetitionScore;
      
      // Random factor for demo purposes (to show variety)
      // In a real implementation, this would be more sophisticated
      const randomFactor = Math.floor(Math.random() * 20) - 10; // -10 to +10
      aiScore += randomFactor;
      
      // Cap at 0-100 range
      return Math.min(100, Math.max(0, aiScore));
    } catch (error) {
      console.error("Error detecting AI content:", error);
      return 30; // Default moderate AI likelihood on error
    }
  }
  
  /**
   * Utility function to calculate standard deviation
   */
  function calculateStandardDeviation(array) {
    const n = array.length;
    if (n === 0) return 0;
    
    const mean = array.reduce((sum, val) => sum + val, 0) / n;
    const squareDiffs = array.map(val => {
      const diff = val - mean;
      return diff * diff;
    });
    
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / n;
    return Math.sqrt(avgSquareDiff);
  }
  
  /**
   * Detect repetitive patterns in text that might indicate AI generation
   */
  function detectRepetitivePatterns(text) {
    // Very simplified detection
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Count sentence starters
    const starters = {};
    sentences.forEach(sentence => {
      const firstWord = sentence.trim().split(' ')[0].toLowerCase();
      if (firstWord.length > 1) { // Ignore single-character starters
        starters[firstWord] = (starters[firstWord] || 0) + 1;
      }
    });
    
    // Calculate repetition score
    let repetitiveScore = 0;
    Object.values(starters).forEach(count => {
      if (count > 3) {
        repetitiveScore += (count - 3) * 2;
      }
    });
    
    return Math.min(25, repetitiveScore); // Cap at 25 points
  }
  
  // Export the functions
  export { detectPhishingRisk, detectAIContent };