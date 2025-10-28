import React from 'react';

const PoweredBySolanaIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg 
      className={className}
      width="120" 
      height="32" 
      viewBox="0 0 120 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stylized "SOL" */}
      <text
        x="2"
        y="22"
        fontFamily="Space Grotesk, sans-serif"
        fontSize="16"
        fontWeight="700"
        fill="url(#solGradient)"
      >
        SOL
      </text>
      
      {/* Powered text */}
      <text
        x="40"
        y="18"
        fontFamily="Space Grotesk, sans-serif"
        fontSize="10"
        fontWeight="500"
        fill="currentColor"
        opacity="0.7"
      >
        Powered by
      </text>
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="solGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#FFA726" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default PoweredBySolanaIllustration;

