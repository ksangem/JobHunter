import type { FC } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

const sizeMap = {
  sm: { height: 32 },
  md: { height: 40 },
  lg: { height: 56 },
} as const;

/**
 * Yojo Solutions branded logo using transparent PNG.
 * Works on both light and dark backgrounds.
 * - variant="light": applies brightness filter for better visibility on dark bg
 * - variant="dark" (default): standard rendering for light backgrounds
 */
export const Logo: FC<LogoProps> = ({ size = 'md', showText = true, variant = 'dark' }) => {
  const { height } = sizeMap[size];
  const base = import.meta.env.BASE_URL || '/';
  const filterStyle = variant === 'light' ? { filter: 'brightness(1.3) contrast(1.1)' } : {};

  if (!showText) {
    return (
      <div className="overflow-hidden flex-shrink-0" style={{ width: height, height }}>
        <img
          src={`${base}yojo-logo.png`}
          alt="Yojo Solutions"
          style={{ height: height * 1.15, objectFit: 'contain', objectPosition: 'left center', ...filterStyle }}
        />
      </div>
    );
  }

  return (
    <img
      src={`${base}yojo-logo.png`}
      alt="Yojo Solutions — Job Hunter Platform"
      style={{ height, ...filterStyle }}
      className="object-contain flex-shrink-0"
    />
  );
};

export default Logo;
