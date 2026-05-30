import type { FC } from 'react';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { container: 'h-10 w-10', text: 'text-xs', ring: 32, stroke: 3, radius: 13 },
  md: { container: 'h-14 w-14', text: 'text-sm', ring: 48, stroke: 3.5, radius: 19 },
  lg: { container: 'h-20 w-20', text: 'text-lg', ring: 72, stroke: 4, radius: 30 },
} as const;

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-success-500';
  if (score >= 60) return 'text-warning-500';
  return 'text-danger-500';
}

function getStrokeColor(score: number): string {
  if (score >= 80) return 'stroke-success-500';
  if (score >= 60) return 'stroke-warning-500';
  return 'stroke-danger-500';
}

const ScoreBadge: FC<ScoreBadgeProps> = ({ score, size = 'md' }) => {
  const clamped = Math.max(0, Math.min(100, score));
  const cfg = sizeConfig[size];
  const circumference = 2 * Math.PI * cfg.radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${cfg.container}`}>
      <svg
        width={cfg.ring}
        height={cfg.ring}
        viewBox={`0 0 ${cfg.ring} ${cfg.ring}`}
        className="-rotate-90"
      >
        {/* Background track */}
        <circle
          cx={cfg.ring / 2}
          cy={cfg.ring / 2}
          r={cfg.radius}
          fill="none"
          className="stroke-surface-200"
          strokeWidth={cfg.stroke}
        />
        {/* Progress arc */}
        <circle
          cx={cfg.ring / 2}
          cy={cfg.ring / 2}
          r={cfg.radius}
          fill="none"
          className={getStrokeColor(clamped)}
          strokeWidth={cfg.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={`absolute font-bold ${cfg.text} ${getScoreColor(clamped)}`}>
        {clamped}
      </span>
    </div>
  );
};

export default ScoreBadge;
