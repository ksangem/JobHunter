import { Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Loader, ErrorState, EmptyState } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Screen } from '@/components/ui/Screen';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { Heatmap } from '@/components/shared/Charts';
import { StatRow } from '@/components/shared/domain';
import { useGetMarketIntelQuery } from '@/store/api/recruiterApi';
import { formatCurrency } from '@/lib/utils';

const CITIES = ['Bengaluru', 'Hyderabad', 'Pune', 'Remote'];

export default function MarketIntelScreen() {
  const { data, isLoading, isError, refetch } = useGetMarketIntelQuery();
  const roles = data?.roles ?? [];

  // Deterministic heatmap value from demand_index.
  const topRoles = roles.slice(0, 4);
  const cell = (roleName: string, city: string) => {
    const role = roles.find((r) => r.role === roleName);
    const colIdx = CITIES.indexOf(city);
    return ((role?.demand_index ?? 0) + colIdx * 7) % 100;
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: true, title: 'Market Intelligence' }} />
      <Screen>
        {isLoading ? (
          <Loader label="Loading market data…" />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : !roles.length ? (
          <EmptyState title="No market data" subtitle="Market intelligence will appear here." />
        ) : (
          <View className="gap-4">
            <View className="flex-row flex-wrap gap-3">
              {roles.map((r) => (
                <Card key={r.role} className="min-w-[280px] flex-1">
                  <View className="flex-row items-center gap-4">
                    <ScoreRing score={r.demand_index} size={64} label="demand" />
                    <View className="flex-1">
                      <Text className="text-base font-bold text-gray-900">{r.role}</Text>
                      <Text className="mt-0.5 text-sm text-gray-500">{r.open_roles.toLocaleString('en-IN')} open roles</Text>
                    </View>
                  </View>
                  <View className="mt-2">
                    <StatRow label="Avg. salary" value={formatCurrency(r.avg_salary, 'INR')} />
                    <View className="flex-row items-center justify-between border-b border-gray-100 py-2.5">
                      <Text className="text-sm text-gray-500">YoY growth</Text>
                      <Text className={`text-sm font-semibold ${r.yoy_growth >= 0 ? 'text-success' : 'text-danger'}`}>
                        {r.yoy_growth >= 0 ? '▲' : '▼'} {Math.abs(r.yoy_growth)}%
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>

            <Card>
              <SectionHeader title="Talent heatmap" subtitle="Demand intensity by location" />
              <Heatmap rows={topRoles.map((r) => r.role)} cols={CITIES} cell={cell} />
            </Card>
          </View>
        )}
      </Screen>
    </View>
  );
}
