import React, { useState } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
  onClick?: () => void;
  ariaLabel?: string;
  itemScope?: boolean;
  itemType?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  accentColor = 'rgba(34, 211, 238, 0.13)',
  onClick,
  ariaLabel,
  itemScope,
  itemType,
}) => {
  const [coords, setCoords] = useState({ x: -300, y: -300 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      itemScope={itemScope}
      itemType={itemType}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden transition-all duration-300 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(480px circle at ${coords.x}px ${coords.y}px, ${accentColor}, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
};
