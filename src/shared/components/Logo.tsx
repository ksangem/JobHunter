import type { FC } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeMap = {
  sm: { icon: 24, text: 'text-sm' },
  md: { icon: 32, text: 'text-lg' },
  lg: { icon: 48, text: 'text-2xl' },
} as const;

export const Logo: FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const { icon, text } = sizeMap[size];

  return (
    <div className="flex items-center gap-2">
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary-600"
      >
        {/* Outer ring */}
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" fill="none" />
        {/* Inner ring */}
        <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
        {/* Center dot */}
        <circle cx="24" cy="24" r="4" fill="currentColor" />
        {/* Crosshair lines */}
        <line x1="24" y1="0" x2="24" y2="10" stroke="currentColor" strokeWidth="2.5" />
        <line x1="24" y1="38" x2="24" y2="48" stroke="currentColor" strokeWidth="2.5" />
        <line x1="0" y1="24" x2="10" y2="24" stroke="currentColor" strokeWidth="2.5" />
        <line x1="38" y1="24" x2="48" y2="24" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      {showText && (
        <span className={`${text} font-bold tracking-wider text-primary-600`}>
          JOB HUNTER
        </span>
      )}
    </div>
  );
};

export default Logo;
