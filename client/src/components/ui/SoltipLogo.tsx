import React from 'react';

interface SoltipLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const SoltipLogo: React.FC<SoltipLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const sizes = {
    sm: { icon: 'h-6 w-6', text: 'text-base' },
    md: { icon: 'h-8 w-8', text: 'text-xl' },
    lg: { icon: 'h-12 w-12', text: 'text-3xl' }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Simple S logo with Solana colors */}
      <div className={`${sizes[size].icon} flex items-center justify-center rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FFA726] text-white font-bold ${sizes[size].text}`}>
        S
      </div>
      {showText && (
        <span className={`font-bold ${sizes[size].text} text-brand-foreground`}>
          Soltip
        </span>
      )}
    </div>
  );
};

// Simple inline SVG logo (alternative)
export const SoltipLogoSVG: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Purple circle background */}
      <circle cx="100" cy="100" r="90" fill="url(#gradient)" />
      
      {/* S letter */}
      <path
        d="M120 60C120 48 112 40 100 40C88 40 80 48 80 60C80 68 84 74 92 78C84 82 80 88 80 96C80 108 88 116 100 116C112 116 120 108 120 96M100 50C106 50 110 54 110 60C110 66 106 70 100 74C94 70 90 66 90 60C90 54 94 50 100 50ZM100 82C106 86 110 90 110 96C110 102 106 106 100 106C94 106 90 102 90 96C90 90 94 86 100 82Z"
        fill="white"
      />
      
      {/* Drip effect */}
      <ellipse cx="100" cy="130" rx="8" ry="12" fill="#FFA726" opacity="0.8" />
      <ellipse cx="100" cy="145" rx="6" ry="8" fill="#FFA726" opacity="0.6" />
      <ellipse cx="100" cy="155" rx="4" ry="6" fill="#FFA726" opacity="0.4" />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="200">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#FFA726" />
        </linearGradient>
      </defs>
    </svg>
  );
};

