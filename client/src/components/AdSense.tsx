import { useEffect, useRef } from 'react';
import { ADSENSE_CONFIG, initializeAdSense, pushAd } from '@/lib/adsense';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: 'in-article' | '';
  adLayoutKey?: string;
  adStyle?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto',
  adLayout = '',
  adLayoutKey,
  adStyle = { display: 'block' },
  className = ''
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only initialize once per component
    if (isInitialized.current) return;
    
    // Initialize AdSense script
    initializeAdSense();

    // Push ad after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (adRef.current && !isInitialized.current) {
        pushAd();
        isInitialized.current = true;
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={adRef} className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={ADSENSE_CONFIG.PUBLISHER_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Banner Ad Component
export function BannerAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot={ADSENSE_CONFIG.AD_SLOTS.HOME_BANNER}
      adFormat="auto"
      className={`ad-banner ${className}`}
      adStyle={{ 
        display: 'block',
        minHeight: '90px',
        maxHeight: '280px'
      }}
    />
  );
}

// Square Ad Component
export function SquareAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot={ADSENSE_CONFIG.AD_SLOTS.HOME_SQUARE}
      adFormat="rectangle"
      className={`ad-square ${className}`}
      adStyle={{ 
        display: 'block',
        width: '300px',
        height: '250px'
      }}
    />
  );
}

// Sidebar Ad Component
export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot={ADSENSE_CONFIG.AD_SLOTS.BUILDER_SIDEBAR}
      adFormat="vertical"
      className={`ad-sidebar ${className}`}
      adStyle={{ 
        display: 'block',
        width: '160px',
        height: '600px'
      }}
    />
  );
}

// In-Article Ad Component  
export function InArticleAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot={ADSENSE_CONFIG.AD_SLOTS.HOME_SQUARE}
      adFormat="auto"
      adLayout="in-article"
      className={className}
      adStyle={{ 
        display: 'block',
        textAlign: 'center' as const
      }}
    />
  );
}

// Builder Banner Ad Component
export function BuilderBannerAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot={ADSENSE_CONFIG.AD_SLOTS.BUILDER_BANNER}
      adFormat="auto"
      className={`ad-banner ${className}`}
      adStyle={{ 
        display: 'block',
        minHeight: '90px',
        maxHeight: '280px'
      }}
    />
  );
}