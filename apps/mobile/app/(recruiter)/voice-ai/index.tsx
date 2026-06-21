import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { CallStatus, CampaignStatus, RiskLevel, type CallLog, type VoiceCampaign } from '@jobhunter/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Loader, EmptyState } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { TopBar } from '@/components/shared/TopBar';
import { ConsentGate } from '@/components/shared/ConsentGate';
import { SideSheet } from '@/components/shared/SideSheet';
import { RiskBadge, GateChecklist, StatRow } from '@/components/shared/domain';
import {
  useListVoiceCampaignsQuery,
  useVoiceCampaignActionMutation,
  useGetCallLogsQuery,
  useCreateVoiceCampaignMutation,
  useListJdsQuery,
} from '@/store/api/recruiterApi';

function errText(e: unknown): string {
  const err = (e as { data?: { title?: string; detail?: string } })?.data;
  return err?.detail ?? err?.title ?? 'Something went wrong.';
}

const STATUS_TONE: Record<CampaignStatus, 'gray' | 'success' | 'warning' | 'navy'> = {
  [CampaignStatus.DRAFT]: 'gray',
  [CampaignStatus.LAUNCHED]: 'success',
  [CampaignStatus.PAUSED]: 'warning',
  [CampaignStatus.COMPLETED]: 'navy',
};

export default function VoiceAiScreen() {
  const { data: campaigns, isLoading } = useListVoiceCampaignsQuery();
  const [action, { isLoading: acting }] = useVoiceCampaignActionMutation();

  const [logsFor, setLogsFor] = useState<VoiceCampaign | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const runAction = async (id: string, act: 'launch' | 'pause' | 'resume') => {
    setBanner(null);
    try {
      await action({ id, action: act }).unwrap();
    } catch (e) {
      setBanner(errText(e));
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Voice AI" bellRoute="/(candidate)/notifications" />
      <Screen>
        <View className="mb-4 flex-row items-center justify-between">
          <Button label="+ New campaign" size="sm" onPress={() => setCreateOpen(true)} />
          <View>
            <Button label="Email campaigns →" variant="ghost" size="sm" onPress={() => router.push('/(recruiter)/email')} />
          </View>
        </View>

        {banner ? (
          <View className="mb-3 rounded-xl border border-warning-100 bg-warning-50 px-3 py-2">
            <Text className="text-sm font-medium text-warning">{banner}</Text>
          </View>
        ) : null}

        {isLoading ? (
          <Loader label="Loading campaigns…" />
        ) : !campaigns?.length ? (
          <EmptyState title="No voice campaigns" subtitle="Create a campaign to begin AI screening calls." />
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {campaigns.map((c) => {
              const total = c.total_candidates || 1;
              const pct = Math.round((c.completed_calls / total) * 100);
              return (
                <Card key={c.id} onPress={() => setLogsFor(c)} className="min-w-[300px] flex-1">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-2">
                      <Text className="text-base font-bold text-gray-900">{c.name}</Text>
                      <Text className="mt-0.5 text-sm text-gray-500">{c.jd_title ?? '—'}</Text>
                    </View>
                    <Badge label={c.status} tone={STATUS_TONE[c.status]} dot />
                  </View>

                  <View className="mt-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-xs text-gray-500">{c.completed_calls}/{c.total_candidates} calls</Text>
                      <Text className="text-xs font-semibold text-gray-700">{pct}%</Text>
                    </View>
                    <View className="mt-1.5">
                      <ProgressBar value={pct} tone="success" />
                    </View>
                  </View>

                  <View className="mt-3 flex-row flex-wrap gap-2">
                    <Badge label={`${c.skipped_calls} skipped`} tone={c.skipped_calls > 0 ? 'danger' : 'gray'} />
                    <Badge label={`${c.calls_per_hour}/hr`} tone="info" />
                    <Badge label={`${c.consenting_count} consenting`} tone="brand" />
                  </View>

                  <View className="mt-3 flex-row gap-2">
                    {c.status === CampaignStatus.DRAFT || c.status === CampaignStatus.PAUSED ? (
                      <View className="flex-1">
                        <Button
                          label={c.status === CampaignStatus.PAUSED ? 'Resume' : 'Launch'}
                          size="sm"
                          loading={acting}
                          onPress={() => runAction(c.id, c.status === CampaignStatus.PAUSED ? 'resume' : 'launch')}
                        />
                      </View>
                    ) : c.status === CampaignStatus.LAUNCHED ? (
                      <View className="flex-1">
                        <Button label="Pause" variant="outline" size="sm" loading={acting} onPress={() => runAction(c.id, 'pause')} />
                      </View>
                    ) : null}
                  </View>

                  {c.status === CampaignStatus.DRAFT ? (
                    <View className="mt-3">
                      <ConsentGate total={c.total_candidates} consenting={c.consenting_count} />
                    </View>
                  ) : null}
                </Card>
              );
            })}
          </View>
        )}
      </Screen>

      <CallLogsSheet campaign={logsFor} onClose={() => setLogsFor(null)} />
      <CreateCampaignSheet visible={createOpen} onClose={() => setCreateOpen(false)} onError={setBanner} />
    </View>
  );
}

function CallLogsSheet({ campaign, onClose }: { campaign: VoiceCampaign | null; onClose: () => void }) {
  const { data: logs, isLoading } = useGetCallLogsQuery(campaign?.id ?? '', { skip: !campaign });
  return (
    <SideSheet visible={!!campaign} onClose={onClose} title="Call logs">
      {isLoading ? (
        <Loader />
      ) : !logs?.length ? (
        <EmptyState title="No calls yet" subtitle="Calls appear here once the campaign runs." />
      ) : (
        <View className="gap-3">
          <Text className="text-xs text-gray-500">HIGH/CRITICAL risk calls are flagged for manual recruiter review before any further action.</Text>
          {logs.map((log) => (
            <CallLogRow key={log.id} log={log} />
          ))}
        </View>
      )}
    </SideSheet>
  );
}

function CallLogRow({ log }: { log: CallLog }) {
  const [showGate, setShowGate] = useState(false);
  const highRisk = log.risk_level === RiskLevel.HIGH || log.risk_level === RiskLevel.CRITICAL;
  return (
    <Card className={highRisk ? 'border-danger-100' : undefined}>
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-base font-bold text-gray-900">{log.candidate_name}</Text>
        <Badge label={log.status} tone={log.status === CallStatus.COMPLETED ? 'success' : log.status === CallStatus.SKIPPED ? 'danger' : 'gray'} />
      </View>

      {log.status === CallStatus.SKIPPED ? (
        <Text className="mt-2 text-sm font-medium text-danger">Skipped: {log.skip_reason}</Text>
      ) : null}

      {log.status === CallStatus.COMPLETED ? (
        <View className="mt-2">
          <StatRow label="Duration" value={`${Math.round((log.duration_sec ?? 0) / 60)}m ${(log.duration_sec ?? 0) % 60}s`} />
          {log.risk_level ? (
            <View className="flex-row items-center justify-between border-b border-gray-100 py-2.5">
              <Text className="text-sm text-gray-500">Risk</Text>
              <RiskBadge level={log.risk_level} />
            </View>
          ) : null}
          <StatRow label="Intent confidence" value={`${Math.round((log.intent_confidence ?? 0) * 100)}%`} />
          {log.outcome ? <StatRow label="Outcome" value={log.outcome} /> : null}
          {highRisk ? (
            <Text className="mt-2 text-xs font-medium text-danger">
              {log.risk_level} risk — requires manual recruiter review; do not auto-advance.
            </Text>
          ) : null}
        </View>
      ) : null}

      {log.gate ? (
        <View className="mt-3">
          <Pressable onPress={() => setShowGate((s) => !s)} className="flex-row items-center">
            <Text className="text-sm font-semibold text-brand">{showGate ? 'Hide' : 'Show'} pre-call gate</Text>
          </Pressable>
          {showGate ? (
            <View className="mt-2">
              <GateChecklist gate={log.gate} />
            </View>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

function CreateCampaignSheet({ visible, onClose, onError }: { visible: boolean; onClose: () => void; onError: (s: string | null) => void }) {
  const { data: jds } = useListJdsQuery();
  const [createCampaign, { isLoading }] = useCreateVoiceCampaignMutation();

  const [step, setStep] = useState(1);
  const [jdId, setJdId] = useState<string>('jd_1');
  const [name, setName] = useState('');
  const [cph, setCph] = useState('30');

  const jd = jds?.find((j) => j.id === jdId);
  const cphNum = Number(cph) || 0;
  const validStep1 = name.trim().length > 0 && cphNum >= 10 && cphNum <= 50;

  const reset = () => {
    setStep(1);
    setName('');
    setCph('30');
    setJdId('jd_1');
  };
  const close = () => {
    reset();
    onClose();
  };

  const submit = async () => {
    onError(null);
    try {
      await createCampaign({
        jd_id: jdId,
        jd_title: jd?.title,
        name: name.trim(),
        calls_per_hour: cphNum,
        total_candidates: jd?.applicant_count ?? 0,
        consenting_count: Math.round((jd?.applicant_count ?? 0) * 0.6),
      }).unwrap();
      close();
    } catch (e) {
      const err = (e as { data?: { detail?: string; title?: string } })?.data;
      onError(err?.detail ?? err?.title ?? 'Could not create campaign.');
    }
  };

  return (
    <SideSheet visible={visible} onClose={close} title="New voice campaign">
      <View className="gap-4">
        {/* Step indicator */}
        <View className="flex-row gap-2">
          {[1, 2, 3].map((s) => (
            <View key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-brand' : 'bg-gray-200'}`} />
          ))}
        </View>

        {step === 1 ? (
          <Card>
            <SectionHeader title="Step 1 · Setup" />
            <View className="gap-3">
              <View>
                <Text className="mb-1.5 text-sm font-medium text-gray-700">Job description</Text>
                <View className="flex-row flex-wrap gap-2">
                  {(jds ?? []).map((j) => {
                    const active = j.id === jdId;
                    return (
                      <Pressable key={j.id} onPress={() => setJdId(j.id)} className={`rounded-full px-3 py-1.5 ${active ? 'bg-brand' : 'bg-white border border-gray-300'}`}>
                        <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{j.title}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
              <Input label="Campaign name" value={name} onChangeText={setName} placeholder="Java SDE Outreach — Wave 2" />
              <Input
                label="Calls per hour (10–50)"
                value={cph}
                onChangeText={setCph}
                keyboardType="number-pad"
                error={cph.length > 0 && (cphNum < 10 || cphNum > 50) ? 'Must be between 10 and 50.' : undefined}
              />
            </View>
          </Card>
        ) : null}

        {step === 2 ? (
          <View className="gap-3">
            <Text className="text-sm text-gray-600">Review consent before launching. Only consenting candidates will be dialed.</Text>
            <ConsentGate total={jd?.applicant_count ?? 0} consenting={Math.round((jd?.applicant_count ?? 0) * 0.6)} />
          </View>
        ) : null}

        {step === 3 ? (
          <Card>
            <SectionHeader title="Step 3 · Confirm" />
            <StatRow label="JD" value={jd?.title ?? '—'} />
            <StatRow label="Name" value={name} />
            <StatRow label="Calls / hour" value={cphNum} />
          </Card>
        ) : null}

        <View className="flex-row gap-2">
          {step > 1 ? (
            <View className="flex-1">
              <Button label="Back" variant="outline" onPress={() => setStep((s) => s - 1)} />
            </View>
          ) : null}
          {step < 3 ? (
            <View className="flex-1">
              <Button label="Next" disabled={step === 1 && !validStep1} onPress={() => setStep((s) => s + 1)} />
            </View>
          ) : (
            <View className="flex-1">
              <Button label="Create campaign" loading={isLoading} onPress={submit} />
            </View>
          )}
        </View>
      </View>
    </SideSheet>
  );
}
