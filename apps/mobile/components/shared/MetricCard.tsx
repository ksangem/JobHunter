import { Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';

interface MetricCardProps {
  value: string | number;
  label: string;
  delta?: number; // % change
  hint?: string;
  /** Every metric card drills down (Critical Rule §5). */
  onPress?: () => void;
  accent?: string;
}

export function MetricCard({ value, label, delta, hint, onPress, accent = '#2563EB' }: MetricCardProps) {
  return (
    <Card onPress={onPress} className="min-w-[150px] flex-1">
      <View className="h-1 w-8 rounded-full" style={{ backgroundColor: accent }} />
      <Text className="mt-3 text-3xl font-extrabold text-navy-900">{value}</Text>
      <Text className="mt-1 text-sm text-gray-500">{label}</Text>
      {delta !== undefined ? (
        <Text className={`mt-1.5 text-xs font-semibold ${delta >= 0 ? 'text-success' : 'text-danger'}`}>
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}%
        </Text>
      ) : hint ? (
        <Text className="mt-1.5 text-xs text-gray-400">{hint}</Text>
      ) : null}
      {onPress ? <Text className="mt-2 text-xs font-semibold text-brand">View details →</Text> : null}
    </Card>
  );
}
