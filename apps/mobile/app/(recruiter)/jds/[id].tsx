import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { JdStatus, type PriorityMatrix } from '@jobhunter/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader, ErrorState } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Screen } from '@/components/ui/Screen';
import { SkillChips, StatRow } from '@/components/shared/domain';
import {
  useGetJdQuery,
  useTransitionJdMutation,
  useSetPriorityMatrixMutation,
} from '@/store/api/recruiterApi';
import { formatCurrency, formatDate } from '@/lib/utils';

const DEFAULT_MATRIX: PriorityMatrix = { skills: 40, experience: 25, notice: 10, location: 15, salary: 5, cert: 5 };

const MATRIX_FIELDS: { key: keyof PriorityMatrix; label: string }[] = [
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'notice', label: 'Notice period' },
  { key: 'location', label: 'Location' },
  { key: 'salary', label: 'Salary' },
  { key: 'cert', label: 'Certifications' },
];

function errText(e: unknown): string {
  const err = (e as { data?: { title?: string; detail?: string } })?.data;
  return err?.detail ?? err?.title ?? 'Something went wrong.';
}

export default function JdDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: jd, isLoading, isError, refetch } = useGetJdQuery(id);
  const [transition, { isLoading: transitioning }] = useTransitionJdMutation();
  const [saveMatrix, { isLoading: saving }] = useSetPriorityMatrixMutation();

  const [matrix, setMatrix] = useState<PriorityMatrix>(jd?.priority_matrix ?? DEFAULT_MATRIX);
  const [matrixInit, setMatrixInit] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [matrixError, setMatrixError] = useState<string | null>(null);

  // Seed matrix from JD once loaded.
  if (jd && !matrixInit) {
    setMatrix(jd.priority_matrix ?? DEFAULT_MATRIX);
    setMatrixInit(true);
  }

  const sum = MATRIX_FIELDS.reduce((s, f) => s + (matrix[f.key] || 0), 0);

  const adjust = (key: keyof PriorityMatrix, delta: number) =>
    setMatrix((m) => ({ ...m, [key]: Math.max(0, Math.min(100, (m[key] || 0) + delta)) }));

  const onTransition = async (action: 'submit-review' | 'approve' | 'publish' | 'close') => {
    setBanner(null);
    try {
      await transition({ id, action }).unwrap();
      setBanner('JD updated.');
    } catch (e) {
      setBanner(errText(e));
    }
  };

  const onSaveMatrix = async () => {
    setMatrixError(null);
    try {
      await saveMatrix({ id, matrix }).unwrap();
      setBanner('Priority matrix saved.');
    } catch (e) {
      setMatrixError(errText(e));
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: true, title: jd?.title ?? 'Job description' }} />
      <Screen>
        {isLoading ? (
          <Loader label="Loading JD…" />
        ) : isError || !jd ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <View className="gap-4">
            <Card>
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-2">
                  <Text className="text-xl font-extrabold text-navy-900">{jd.title}</Text>
                  <Text className="mt-1 text-sm text-gray-500">{jd.location} · {jd.work_mode}</Text>
                </View>
                <Badge label={jd.status} tone="navy" dot />
              </View>
              <View className="mt-3">
                <SkillChips skills={jd.skills} max={12} />
              </View>
              <View className="mt-3">
                <StatRow label="Experience" value={`${jd.exp_min}${jd.exp_max ? `–${jd.exp_max}` : '+'} yrs`} />
                <StatRow
                  label="Salary"
                  value={jd.salary_min ? `${formatCurrency(jd.salary_min, jd.currency)}${jd.salary_max ? ` – ${formatCurrency(jd.salary_max, jd.currency)}` : ''}` : '—'}
                />
                <StatRow label="Closes" value={formatDate(jd.expected_close_date)} />
                <StatRow label="Applicants" value={jd.applicant_count ?? 0} />
              </View>
              {jd.description ? <Text className="mt-3 text-sm text-gray-600">{jd.description}</Text> : null}
            </Card>

            {banner ? (
              <View className="rounded-xl border border-success-100 bg-success-50 px-3 py-2">
                <Text className="text-sm font-medium text-success">{banner}</Text>
              </View>
            ) : null}

            {/* Lifecycle */}
            <Card>
              <SectionHeader title="Lifecycle" subtitle="JD approval workflow (FR-R-013)" />
              {jd.status === JdStatus.DRAFT ? (
                <Button label="Submit for review" loading={transitioning} onPress={() => onTransition('submit-review')} />
              ) : jd.status === JdStatus.REVIEW ? (
                <Button label="Approve" variant="success" loading={transitioning} onPress={() => onTransition('approve')} />
              ) : jd.status === JdStatus.APPROVED ? (
                <Button label="Publish" loading={transitioning} onPress={() => onTransition('publish')} />
              ) : jd.status === JdStatus.ACTIVE ? (
                <Button label="Close" variant="danger" loading={transitioning} onPress={() => onTransition('close')} />
              ) : (
                <Text className="text-sm text-gray-400">No actions available for {jd.status}.</Text>
              )}
            </Card>

            {/* Priority matrix */}
            <Card>
              <SectionHeader title="Priority matrix" subtitle="Weighting for AI ranking — must total 100" />
              <View className="gap-2">
                {MATRIX_FIELDS.map((f) => (
                  <View key={f.key} className="flex-row items-center justify-between">
                    <Text className="flex-1 text-sm text-gray-700">{f.label}</Text>
                    <View className="flex-row items-center gap-2">
                      <Stepper label="−" onPress={() => adjust(f.key, -5)} />
                      <View className="w-12 items-center rounded-lg bg-gray-100 py-1.5">
                        <Text className="text-sm font-bold text-gray-900">{matrix[f.key]}</Text>
                      </View>
                      <Stepper label="+" onPress={() => adjust(f.key, 5)} />
                    </View>
                  </View>
                ))}
              </View>
              <View className="mt-3 flex-row items-center justify-between border-t border-gray-100 pt-3">
                <Text className="text-sm font-semibold text-gray-700">Total</Text>
                <Text className={`text-lg font-extrabold ${sum === 100 ? 'text-success' : 'text-danger'}`}>{sum}</Text>
              </View>
              {matrixError ? <Text className="mt-2 text-sm text-danger">{matrixError}</Text> : null}
              <View className="mt-3">
                <Button label="Save matrix" loading={saving} disabled={sum !== 100} onPress={onSaveMatrix} />
              </View>
            </Card>
          </View>
        )}
      </Screen>
    </View>
  );
}

function Stepper({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="h-8 w-8 items-center justify-center rounded-lg bg-brand-50 active:bg-brand-100">
      <Text className="text-base font-bold text-brand">{label}</Text>
    </Pressable>
  );
}
