import type { FC } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}

const trendConfig = {
  up: { Icon: TrendingUp, color: 'text-success-600', bg: 'bg-success-50' },
  down: { Icon: TrendingDown, color: 'text-danger-600', bg: 'bg-danger-50' },
  neutral: { Icon: Minus, color: 'text-surface-500', bg: 'bg-surface-100' },
} as const;

const StatCard: FC<StatCardProps> = ({ title, value, change, trend, icon: CardIcon }) => {
  const { Icon: TrendIcon, color, bg } = trendConfig[trend];

  return (
    <div className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-surface-500">{title}</p>
          <p className="text-2xl font-bold text-surface-900">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <CardIcon className="h-5 w-5" />
        </div>
      </div>
      <div className={`mt-3 flex items-center gap-1 ${color}`}>
        <TrendIcon className="h-4 w-4" />
        <span className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${bg} ${color}`}>
          {change}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
