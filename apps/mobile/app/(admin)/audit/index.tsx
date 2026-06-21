import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type AuditLog } from '@jobhunter/types';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader, EmptyState } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TopBar } from '@/components/shared/TopBar';
import { useListAuditQuery, useRequestErasureMutation } from '@/store/api/adminApi';
import { COLORS } from '@/lib/constants';
import { relativeTime } from '@/lib/utils';

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-3 py-1.5 active:opacity-70 ${
        active ? 'border-brand bg-brand' : 'border-gray-300 bg-white'
      }`}
    >
      <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{label}</Text>
    </Pressable>
  );
}

function AuditRow({ log }: { log: AuditLog }) {
  return (
    <Card>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <View className="self-start rounded-md bg-navy-100 px-2 py-1">
            <Text className="font-mono text-xs font-semibold text-navy-700">{log.action}</Text>
          </View>
          <Text className="mt-2 text-sm font-bold text-gray-900">{log.actor_name ?? log.actor_id}</Text>
          <Text className="mt-0.5 text-xs text-gray-500">
            {log.resource}
            {log.resource_id ? ` · ${log.resource_id}` : ''}
          </Text>
          <Text className="mt-0.5 text-xs text-gray-400">
            {log.org_id ?? 'platform'}
            {log.ip ? ` · ${log.ip}` : ''}
          </Text>
        </View>
        <Text className="text-xs text-gray-400">{relativeTime(log.created_at)}</Text>
      </View>
    </Card>
  );
}

function GdprErasureCard() {
  const [requestErasure, { isLoading }] = useRequestErasureMutation();
  const [candidateId, setCandidateId] = useState('');
  const [result, setResult] = useState<{ workflow_id: string; sla_days: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const id = candidateId.trim();
    if (!id) {
      setError('Enter a candidate ID');
      return;
    }
    setError(null);
    try {
      const res = await requestErasure({ candidate_id: id }).unwrap();
      setResult(res);
      setCandidateId('');
    } catch {
      setError('Erasure request failed. Try again.');
    }
  };

  return (
    <Card>
      <SectionHeader title="GDPR erasure" subtitle="Right to be forgotten — FR-A-007" />
      <Input
        label="Candidate ID"
        placeholder="e.g. cand_1"
        value={candidateId}
        onChangeText={setCandidateId}
        autoCapitalize="none"
        error={error ?? undefined}
      />
      <View className="mt-3">
        <Button label="Request erasure" variant="danger" loading={isLoading} fullWidth onPress={submit} />
      </View>
      {result ? (
        <View className="mt-3 flex-row items-center gap-2 rounded-lg bg-success-100 px-2.5 py-2">
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text className="flex-1 text-xs font-semibold text-success">
            Temporal workflow {result.workflow_id} started — PII anonymised ≤ {result.sla_days} days.
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

export default function AuditScreen() {
  const { data, isLoading } = useListAuditQuery();
  const [filter, setFilter] = useState<string | null>(null);

  const actions = useMemo(() => Array.from(new Set((data ?? []).map((l) => l.action))).sort(), [data]);
  const filtered = useMemo(
    () => (filter ? (data ?? []).filter((l) => l.action === filter) : (data ?? [])),
    [data, filter]
  );

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Audit Log" />
      <Screen>
        {isLoading ? (
          <Loader label="Loading audit log…" />
        ) : (
          <View className="gap-4">
            {/* Immutability + retention banner */}
            <View className="flex-row items-start gap-2 rounded-xl bg-info-100 px-3 py-3">
              <Ionicons name="lock-closed" size={16} color={COLORS.info} />
              <Text className="flex-1 text-xs leading-5 text-info">
                Audit logs are immutable (append-only — UPDATE/DELETE blocked by a Postgres rule) and retained for 7 years.
              </Text>
            </View>

            <GdprErasureCard />

            {actions.length ? (
              <View className="flex-row flex-wrap gap-2">
                <FilterChip label="All" active={filter === null} onPress={() => setFilter(null)} />
                {actions.map((a) => (
                  <FilterChip key={a} label={a} active={filter === a} onPress={() => setFilter(a)} />
                ))}
              </View>
            ) : null}

            {!filtered.length ? (
              <EmptyState title="No audit entries" subtitle="No matching actions for this filter." />
            ) : (
              <View className="gap-3">
                {filtered.map((log) => (
                  <AuditRow key={log.id} log={log} />
                ))}
              </View>
            )}
          </View>
        )}
      </Screen>
    </View>
  );
}
