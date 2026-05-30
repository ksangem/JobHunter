import type { FC } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

const sizeMap = {
  sm: { height: 32 },
  md: { height: 40 },
  lg: { height: 56 },
  xl: { height: 80 },
} as const;

/**
 * Yojo Solutions branded logo using transparent PNG.
 * - variant="dark" (default): standard rendering for light backgrounds
 * - variant="light": adds glow/drop-shadow for visibility on dark backgrounds
 */
export const Logo: FC<LogoProps> = ({ size = 'md', showText = true, variant = 'dark' }) => {
  const { height } = sizeMap[size];
  const base = import.meta.env.BASE_URL || '/';

  // On dark backgrounds, use drop-shadow to make the logo pop without washing it out
  const darkBgStyle = variant === 'light'
    ? { filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.25)) drop-shadow(0 0 4px rgba(255,255,255,0.15))' }
    : {};

  if (!showText) {
    return (
      <div className="overflow-hidden flex-shrink-0" style={{ width: height, height }}>
        <img
          src={`${base}yojo-logo.png`}
          alt="Yojo Solutions"
          style={{ height: height * 1.15, objectFit: 'contain', objectPosition: 'left center', ...darkBgStyle }}
        />
      </div>
    );
  }

  return (
    <img
      src={`${base}yojo-logo.png`}
      alt="Yojo Solutions — Job Hunter Platform"
      style={{ height, ...darkBgStyle }}
      className="object-contain flex-shrink-0"
    />
  );
};

export default Logo;
