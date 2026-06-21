import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { COLORS } from '@/lib/constants';

type Trend = 'up' | 'down' | 'neutral';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: Trend;
  icon: keyof typeof Ionicons.glyphMap;
  accent?: string;
  onPress?: () => void;
}

const TREND_COLOR: Record<Trend, string> = { up: COLORS.success, down: COLORS.danger, neutral: COLORS.gray400 };
const TREND_ICON: Record<Trend, keyof typeof Ionicons.glyphMap> = { up: 'trending-up', down: 'trending-down', neutral: 'remove' };

/** Dashboard metric tile (ported from prototype StatCard). Drill-down via onPress. */
export function StatCard({ title, value, change, trend = 'neutral', icon, accent = COLORS.brand, onPress }: StatCardProps) {
  return (
    <Card onPress={onPress} className="min-w-[150px] flex-1">
      <View className="flex-row items-start justify-between">
        <Text className="flex-1 pr-2 text-sm text-gray-500">{title}</Text>
        <View className="h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}1A` }}>
          <Ionicons name={icon} size={18} color={accent} />
        </View>
      </View>
      <Text className="mt-2 text-2xl font-extrabold text-navy-900">{value}</Text>
      {change ? (
        <View className="mt-1.5 flex-row items-center gap-1">
          <Ionicons name={TREND_ICON[trend]} size={13} color={TREND_COLOR[trend]} />
          <Text className="text-xs font-semibold" style={{ color: TREND_COLOR[trend] }}>{change}</Text>
        </View>
      ) : null}
    </Card>
  );
}
