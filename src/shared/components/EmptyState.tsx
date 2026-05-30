import type { FC } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: FC<EmptyStateProps> = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-100 text-surface-400">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-surface-900">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-surface-500">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
