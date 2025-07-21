// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  // Replace with your actual AdSense Publisher ID after approval
  PUBLISHER_ID:
  //  process.env.NODE_ENV === 'production' 
  //   ? 'ca-pub-YOUR-ACTUAL-PUBLISHER-ID'
  //   : 
    'ca-pub-3416817773181511', // Test ID for development
    // # <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="
    // #      crossorigin="anonymous"></script>
  // Ad Slot IDs - Replace with your actual slot IDs after creating ads in AdSense
  AD_SLOTS: {
    HOME_BANNER: '1234567890',
    HOME_SQUARE: '1234567891', 
    BUILDER_BANNER: '1234567892',
    BUILDER_SIDEBAR: '1234567893',
    BUILDER_SQUARE: '1234567894',
  },

  // AdSense Script URL
  SCRIPT_URL: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
};

// Initialize AdSense
export function initializeAdSense() {
  // Check if AdSense script is already loaded
  if (document.querySelector(`script[src*="adsbygoogle.js"]`)) {
    return;
  }

  const script = document.createElement('script');
  script.src = `${ADSENSE_CONFIG.SCRIPT_URL}?client=${ADSENSE_CONFIG.PUBLISHER_ID}`;
  script.async = true;
  script.crossOrigin = 'anonymous';
  
  // Add error handling
  script.onerror = () => {
    console.warn('Failed to load AdSense script');
  };

  document.head.appendChild(script);
}

// Initialize adsbygoogle array
export function pushAd() {
  try {
    if (typeof window !== 'undefined') {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    }
  } catch (error) {
    console.warn('AdSense push failed:', error);
  }
}

// Check if AdSense is ready
export function isAdSenseReady(): boolean {
  return typeof window !== 'undefined' && 
         typeof (window as any).adsbygoogle !== 'undefined';
}

// AdSense Policy Compliance Helper
export const AD_POLICY_GUIDELINES = {
  // Ensure content quality
  contentGuidelines: [
    'Provide valuable, original content',
    'Avoid prohibited content (violence, adult content, etc.)',
    'Maintain good user experience',
    'Don\'t click your own ads',
    'Don\'t encourage users to click ads'
  ],
  
  // Ad placement best practices
  placementGuidelines: [
    'Place ads where users naturally look',
    'Don\'t place ads too close to interactive elements',
    'Ensure ads don\'t interfere with navigation',
    'Maintain content-to-ad ratio balance',
    'Use responsive ad units'
  ],
  
  // Technical requirements
  technicalRequirements: [
    'Site must have substantial content',
    'Clear navigation structure',
    'Privacy policy required',
    'HTTPS enabled',
    'Mobile-friendly design'
  ]
};