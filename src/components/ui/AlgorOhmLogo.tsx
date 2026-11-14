import React, { useId } from 'react';

interface AlgorOhmLogoProps {
  className?: string;
}

export const AlgorOhmLogo: React.FC<AlgorOhmLogoProps> = ({
  className = 'w-9 h-9',
}) => {
  const uniqueId = useId();
  const cyanGradId = `algorCyan-${uniqueId}`;
  const amberGradId = `ohmAmber-${uniqueId}`;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={cyanGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id={amberGradId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      {/* Outer Precision Stator Hex */}
      <polygon
        points="24,2 43,13 43,35 24,46 5,35 5,13"
        stroke={`url(#${cyanGradId})`}
        strokeWidth="2"
        fill="rgba(8, 13, 26, 0.85)"
      />
      {/* Inner Ohm Omega + Algor Neural Delta */}
      <path
        d="M14 33 H19.5 L17.5 27.5 C15.2 25.2 14 22.2 14 18.8 C14 13.2 18.5 9 24 9 C29.5 9 34 13.2 34 18.8 C34 22.2 32.8 25.2 30.5 27.5 L28.5 33 H34"
        stroke={`url(#${amberGradId})`}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Central Neural Node */}
      <circle cx="24" cy="19" r="3.2" fill="#22D3EE" />
      <path
        d="M24 12 V15.8 M24 22.2 V26 M17.5 19 H20.8 M27.2 19 H30.5"
        stroke="#22D3EE"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
