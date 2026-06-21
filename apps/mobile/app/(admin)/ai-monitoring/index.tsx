import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type AiMonitorRow } from '@jobhunter/types';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Loader, EmptyState } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TopBar } from '@/components/shared/TopBar';
import { MetricCard } from '@/components/shared/MetricCard';
import { StatRow } from '@/components/shared/domain';
import { useGetAiMonitoringQuery } from '@/store/api/adminApi';
import { COLORS } from '@/lib/constants';

const HALLUCINATION_THRESHOLD = 0.05; // P1 alert: > 5% → pause JD upload (G-020).

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

function FunctionCard({ row }: { row: AiMonitorRow }) {
  const halluc = row.hallucination_rate;
  const overThreshold = halluc > HALLUCINATION_THRESHOLD;
  return (
    <Card className="min-w-[300px] flex-1">
      <View className="flex-row items-start justify-between">
        <Text className="flex-1 pr-2 text-base font-bold text-gray-900">{row.function}</Text>
        <Badge
          label={`${row.calls.toLocaleString()} calls`}
          tone="gray"
        />
      </View>

      {/* Accuracy */}
      <View className="mt-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-500">Accuracy</Text>
          <Text className="text-sm font-semibold text-gray-900">{pct(row.accuracy)}</Text>
        </View>
        <View className="mt-1.5">
          <ProgressBar value={row.accuracy * 100} tone="success" />
        </View>
      </View>

      {/* Hallucination */}
      <View className="mt-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-500">Hallucination rate</Text>
          <Text className={`text-sm font-semibold ${overThreshold ? 'text-danger' : 'text-gray-900'}`}>
            {pct(halluc)}
          </Text>
        </View>
        <View className="mt-1.5">
          <ProgressBar value={halluc * 100} tone={overThreshold ? 'danger' : 'warning'} />
        </View>
      </View>

      <View className="mt-3">
        <StatRow label="Override rate" value={pct(row.override_rate)} />
        <StatRow label="p95 latency" value={`${row.p95_latency_ms.toLocaleString()} ms`} />
        <StatRow label="Token cost" value={`$${row.token_cost_usd.toFixed(2)}`} />
      </View>

      {overThreshold ? (
        <View className="mt-3 flex-row items-center gap-1.5 rounded-lg bg-danger-100 px-2.5 py-2">
          <Ionicons name="warning" size={14} color={COLORS.danger} />
          <Text className="flex-1 text-xs font-semibold text-danger">
            JD upload auto-paused — hallucination above 5% threshold.
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

export default function AiMonitoringScreen() {
  const { data, isLoading } = useGetAiMonitoringQuery();

  const totals = data
    ? {
        calls: data.reduce((s, r) => s + r.calls, 0),
        avgAccuracy: data.reduce((s, r) => s + r.accuracy, 0) / data.length,
        maxHalluc: Math.max(...data.map((r) => r.hallucination_rate)),
        cost: data.reduce((s, r) => s + r.token_cost_usd, 0),
      }
    : null;
  const anyOver = totals ? totals.maxHalluc > HALLUCINATION_THRESHOLD : false;

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="AI Monitoring" />
      <Screen>
        {isLoading ? (
          <Loader label="Loading AI metrics…" />
        ) : !data?.length || !totals ? (
          <EmptyState title="No AI metrics" subtitle="No model telemetry has been recorded yet." />
        ) : (
          <View className="gap-5">
            {anyOver ? (
              <View className="flex-row items-center gap-2 rounded-xl bg-danger-100 px-3 py-3">
                <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
                <Text className="flex-1 text-sm font-semibold text-danger">
                  JD upload auto-paused — a function exceeds the 5% hallucination threshold.
                </Text>
              </View>
            ) : null}

            {/* Summary metrics */}
            <View className="flex-row flex-wrap gap-3">
              <MetricCard value={totals.calls.toLocaleString()} label="Total AI calls" accent={COLORS.brand} />
              <MetricCard value={pct(totals.avgAccuracy)} label="Avg accuracy" accent={COLORS.success} />
              <MetricCard
                value={pct(totals.maxHalluc)}
                label="Max hallucination"
                accent={anyOver ? COLORS.danger : COLORS.warning}
                hint={anyOver ? 'Above 5% threshold' : 'Within threshold'}
              />
              <MetricCard value={`$${totals.cost.toFixed(0)}`} label="Token cost (USD)" accent={COLORS.navy900} />
            </View>

            {/* Per-function */}
            <View>
              <SectionHeader title="Per-function metrics" subtitle="Live model quality telemetry" />
              <View className="flex-row flex-wrap gap-3">
                {data.map((row) => (
                  <FunctionCard key={row.function} row={row} />
                ))}
              </View>
            </View>

            {/* Computation note */}
            <Card>
              <View className="flex-row items-start gap-2">
                <Ionicons name="information-circle-outline" size={16} color={COLORS.info} />
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-gray-700">How these are computed</Text>
                  <Text className="mt-1 text-xs leading-5 text-gray-500">
                    Override rate is derived from ai_audit_logs.reviewer_action. Hallucination rate comes from
                    sampled human review of model outputs. Accuracy is measured against a labelled evaluation set.
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}
      </Screen>
    </View>
  );
}
