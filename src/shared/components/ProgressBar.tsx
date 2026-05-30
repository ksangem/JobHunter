import type { FC } from 'react';

interface ProgressBarProps {
  value: number;
  label?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

const colorClasses = {
  primary: 'bg-primary-600',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
} as const;

const ProgressBar: FC<ProgressBarProps> = ({ value, label, color = 'primary' }) => {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      {(label || true) && (
        <div className="mb-1 flex items-center justify-between">
          {label && <span className="text-sm font-medium text-surface-700">{label}</span>}
          <span className="text-sm font-medium text-surface-500">{clamped}%</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-200">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
