import type { FC } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

const sizeMap = {
  sm: { height: 32, iconSize: 28 },
  md: { height: 40, iconSize: 34 },
  lg: { height: 56, iconSize: 48 },
} as const;

/**
 * Yojo Solutions branded logo.
 * - variant="dark" (default): for white/light backgrounds — shows the original logo image
 * - variant="light": for dark backgrounds — uses SVG icon + styled text (no white-bg PNG)
 */
export const Logo: FC<LogoProps> = ({ size = 'md', showText = true, variant = 'dark' }) => {
  const { height, iconSize } = sizeMap[size];
  const base = import.meta.env.BASE_URL || '/';

  // On dark backgrounds, render an SVG + text so there's no white rectangle
  if (variant === 'light') {
    const textSize = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm';
    const subSize = size === 'lg' ? 'text-xs' : 'text-[9px]';

    return (
      <div className="flex items-center gap-2.5">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          {/* Shield */}
          <path
            d="M32 4 L8 16 L8 34 C8 48 32 60 32 60 C32 60 56 48 56 34 L56 16 Z"
            fill="url(#shieldGradLight)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
          {/* Gear ring */}
          <circle cx="32" cy="34" r="10" fill="none" stroke="#22d3ee" strokeWidth="2" />
          <circle cx="32" cy="34" r="4" fill="#22d3ee" />
          {/* Gear teeth */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 32 + 9 * Math.cos(rad);
            const y1 = 34 + 9 * Math.sin(rad);
            const x2 = 32 + 12.5 * Math.cos(rad);
            const y2 = 34 + 12.5 * Math.sin(rad);
            return (
              <line
                key={angle}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            );
          })}
          {/* Fingerprint accent rings */}
          <circle cx="32" cy="34" r="6.5" fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.5" />
          {/* Shield highlight */}
          <path
            d="M16 18 L16 32 C16 40 24 48 32 54"
            fill="none" stroke="white" strokeWidth="0.6" opacity="0.15"
          />
          {/* Flag */}
          <rect x="38" y="10" width="7" height="5" rx="1" fill="#ef4444" opacity="0.8" />
          <line x1="38" y1="10" x2="38" y2="18" stroke="#ef4444" strokeWidth="0.8" />
          <defs>
            <linearGradient id="shieldGradLight" x1="8" y1="4" x2="56" y2="60">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#1565c0" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
        {showText && (
          <div className="flex flex-col leading-tight">
            <span className={`${textSize} font-bold tracking-wide`}>
              <span className="text-white">Yojo</span>{' '}
              <span className="text-purple-300">Solutions</span>
            </span>
            <span className={`${subSize} font-medium text-cyan-300 tracking-wider uppercase`}>
              Job Hunter Platform
            </span>
          </div>
        )}
      </div>
    );
  }

  // On light backgrounds, use the actual PNG logo image
  if (!showText) {
    return (
      <div className="overflow-hidden flex-shrink-0" style={{ width: height, height }}>
        <img
          src={`${base}yojo-logo.png`}
          alt="Yojo Solutions"
          style={{ height: height * 1.1, objectFit: 'contain', objectPosition: 'left center' }}
        />
      </div>
    );
  }

  return (
    <img
      src={`${base}yojo-logo.png`}
      alt="Yojo Solutions — Job Hunter Platform"
      style={{ height }}
      className="object-contain flex-shrink-0"
    />
  );
};

export default Logo;
