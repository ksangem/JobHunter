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
 * Yojo Solutions branded logo.
 * - variant="dark" (default): original colors for light backgrounds
 * - variant="light": white-text version for dark backgrounds
 */
export const Logo: FC<LogoProps> = ({ size = 'md', showText = true, variant = 'dark' }) => {
  const { height } = sizeMap[size];
  const base = import.meta.env.BASE_URL || '/';
  const src = variant === 'light' ? `${base}yojo-logo-white.png` : `${base}yojo-logo.png`;

  if (!showText) {
    return (
      <div className="overflow-hidden flex-shrink-0" style={{ width: height, height }}>
        <img
          src={src}
          alt="Yojo Solutions"
          style={{ height: height * 1.15, objectFit: 'contain', objectPosition: 'left center' }}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Yojo Solutions — Job Hunter Platform"
      style={{ height }}
      className="object-contain flex-shrink-0"
    />
  );
};

export default Logo;
