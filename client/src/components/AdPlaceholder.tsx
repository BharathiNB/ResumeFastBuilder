import React from 'react';

interface AdPlaceholderProps {
  width?: string;
  height?: string;
  className?: string;
  label?: string;
}

// Development placeholder for ads - shows a styled box indicating where ads will appear
export default function AdPlaceholder({ 
  width = '100%', 
  height = '90px', 
  className = '',
  label = 'Advertisement'
}: AdPlaceholderProps) {
  // Only show placeholder in development
  // if (process.env.NODE_ENV === 'production') {
  //   return null;
  // }

  return (
    <div 
      className={`border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 text-sm ${className}`}
      style={{ width, height }}
    >
      <div className="text-center">
        <div className="mb-1 font-medium">{label}</div>
        <div className="text-xs text-gray-400">{width} x {height}</div>
      </div>
    </div>
  );
}

// Specific placeholder components for different ad types
export function BannerAdPlaceholder({ className = '' }: { className?: string }) {
  return (
    <AdPlaceholder
      width="100%"
      height="90px"
      className={className}
      label="Banner Ad"
    />
  );
}

export function SquareAdPlaceholder({ className = '' }: { className?: string }) {
  return (
    <AdPlaceholder
      width="300px"
      height="250px"
      className={className}
      label="Square Ad"
    />
  );
}

export function SidebarAdPlaceholder({ className = '' }: { className?: string }) {
  return (
    <AdPlaceholder
      width="160px"
      height="600px"
      className={className}
      label="Sidebar Ad"
    />
  );
}