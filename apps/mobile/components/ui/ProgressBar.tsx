import { View } from 'react-native';
import { COLORS } from '@/lib/constants';

const TONE = {
  brand: COLORS.brand,
  success: COLORS.success,
  warning: COLORS.warning,
  danger: COLORS.danger,
} as const;

export function ProgressBar({ value, tone = 'brand', height = 8 }: { value: number; tone?: keyof typeof TONE; height?: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View className="w-full overflow-hidden rounded-full bg-gray-200" style={{ height }}>
      <View style={{ width: `${pct}%`, height, backgroundColor: TONE[tone], borderRadius: height }} />
    </View>
  );
}
