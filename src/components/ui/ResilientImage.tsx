import React, { useState } from 'react';
import { Cpu } from 'lucide-react';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackLabel?: string;
}

/**
 * Renders an image with referrerPolicy="no-referrer", lazy loading by default,
 * and an engineered schematic fallback surface if the remote asset fails to load.
 */
export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
  loading = 'lazy',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt || fallbackLabel || 'AlgorOhm hardware telemetry surface'}
        className={`bg-[#0B101E] bg-tech-grid flex flex-col items-center justify-center p-6 text-center border border-slate-800/80 ${className}`}
      >
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
          <Cpu className="w-6 h-6" aria-hidden="true" />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-semibold">
          {fallbackLabel || 'OPTICAL_FEED_SYNTHETIC'}
        </span>
        <span className="text-[11px] font-mono text-slate-400 mt-1 max-w-xs line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...rest}
    />
  );
};
