import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_TRACKING_ID =  'G-LEQ8DZ2GJR';

export default function GoogleAnalytics() {
  useEffect(() => {
    // Only load in production or when tracking ID is provided
    // if (import.meta.env.MODE !== 'production' && !import.meta.env.VITE_GA_TRACKING_ID) {
    //   return;
    // }

    // Check if Google Analytics is already loaded
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
      return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(args);
    };

    // Configure Google Analytics
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    console.log('Google Analytics initialized');
  }, []);

  return null; // This component doesn't render anything
}

// Helper functions for tracking events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific tracking functions for the resume builder
export const trackResumeEvents = {
  startBuilding: () => trackEvent('start_building', 'resume', 'resume_builder_opened'),
  saveResume: () => trackEvent('save_resume', 'resume', 'resume_saved'),
  downloadPDF: () => trackEvent('download_pdf', 'resume', 'pdf_generated'),
  signUp: () => trackEvent('sign_up', 'user', 'google_sign_in'),
  pageView: (pageName: string) => trackEvent('page_view', 'navigation', pageName),
};