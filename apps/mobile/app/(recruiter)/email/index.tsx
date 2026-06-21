import { useState } from 'react';
import { Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { CampaignStatus, type EmailCampaign } from '@jobhunter/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Loader, EmptyState } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Screen } from '@/components/ui/Screen';
import { Donut } from '@/components/shared/Charts';
import { SideSheet } from '@/components/shared/SideSheet';
import { StatRow } from '@/components/shared/domain';
import {
  useListEmailCampaignsQuery,
  useEmailCampaignActionMutation,
  useCreateEmailCampaignMutation,
} from '@/store/api/recruiterApi';
import { COLORS } from '@/lib/constants';

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

export default function EmailScreen() {
  const { data: campaigns, isLoading } = useListEmailCampaignsQuery();
  const [action, { isLoading: acting }] = useEmailCampaignActionMutation();
  const [createOpen, setCreateOpen] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const runAction = async (id: string, act: 'launch' | 'pause' | 'send-test') => {
    setBanner(null);
    try {
      await action({ id, action: act }).unwrap();
      if (act === 'send-test') setBanner('Test email sent.');
    } catch (e) {
      setBanner(errText(e));
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: true, title: 'Email Campaigns' }} />
      <Screen>
        <View className="mb-4 flex-row items-center justify-between">
          <Button label="+ New campaign" size="sm" onPress={() => setCreateOpen(true)} />
          <Text className="flex-1 pl-3 text-xs text-gray-400">Unsubscribes are auto-excluded from all sends.</Text>
        </View>

        {banner ? (
          <View className="mb-3 rounded-xl border border-info-100 bg-info-50 px-3 py-2">
            <Text className="text-sm font-medium text-info">{banner}</Text>
          </View>
        ) : null}

        {isLoading ? (
          <Loader label="Loading campaigns…" />
        ) : !campaigns?.length ? (
          <EmptyState title="No email campaigns" subtitle="Create a campaign to reach candidates." />
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {campaigns.map((c) => {
              const openRate = c.sent ? Math.round((c.opened / c.sent) * 100) : 0;
              return (
                <Card key={c.id} className="min-w-[300px] flex-1">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-2">
                      <Text className="text-base font-bold text-gray-900">{c.name}</Text>
                      <Text className="mt-0.5 text-sm text-gray-500">{c.subject}</Text>
                    </View>
                    <Badge label={c.status} tone={STATUS_TONE[c.status]} dot />
                  </View>

                  <View className="mt-3 flex-row items-center gap-4">
                    <Donut
                      size={88}
                      segments={[
                        { value: c.opened, color: COLORS.success, label: 'Opened' },
                        { value: Math.max(0, c.sent - c.opened), color: COLORS.gray200, label: 'Unopened' },
                      ]}
                    />
                    <View className="flex-1">
                      <Text className="text-2xl font-extrabold text-navy-900">{openRate}%</Text>
                      <Text className="text-xs text-gray-400">open rate</Text>
                    </View>
                  </View>

                  <View className="mt-2">
                    <StatRow label="Sent" value={c.sent} />
                    <StatRow label="Opened" value={c.opened} />
                    <StatRow label="Clicked" value={c.clicked} />
                    <StatRow label="Unsubscribed" value={c.unsubscribed} />
                  </View>

                  <View className="mt-3 flex-row gap-2">
                    {c.status === CampaignStatus.DRAFT || c.status === CampaignStatus.PAUSED ? (
                      <View className="flex-1">
                        <Button label="Launch" size="sm" loading={acting} onPress={() => runAction(c.id, 'launch')} />
                      </View>
                    ) : c.status === CampaignStatus.LAUNCHED ? (
                      <View className="flex-1">
                        <Button label="Pause" variant="outline" size="sm" loading={acting} onPress={() => runAction(c.id, 'pause')} />
                      </View>
                    ) : null}
                    <View className="flex-1">
                      <Button label="Send test" variant="ghost" size="sm" loading={acting} onPress={() => runAction(c.id, 'send-test')} />
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </Screen>

      <CreateEmailSheet visible={createOpen} onClose={() => setCreateOpen(false)} onError={setBanner} />
    </View>
  );
}

function CreateEmailSheet({ visible, onClose, onError }: { visible: boolean; onClose: () => void; onError: (s: string | null) => void }) {
  const [createCampaign, { isLoading }] = useCreateEmailCampaignMutation();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const recipientCount = 48; // preview count (mock)

  const reset = () => {
    setStep(1);
    setName('');
    setSubject('');
    setBody('');
  };
  const close = () => {
    reset();
    onClose();
  };

  const submit = async () => {
    onError(null);
    try {
      await createCampaign({
        name: name.trim() || subject.trim(),
        subject: subject.trim(),
        total_recipients: recipientCount,
      }).unwrap();
      close();
    } catch (e) {
      const err = (e as { data?: { detail?: string; title?: string } })?.data;
      onError(err?.detail ?? err?.title ?? 'Could not create campaign.');
    }
  };

  return (
    <SideSheet visible={visible} onClose={close} title="New email campaign">
      <View className="gap-4">
        <View className="flex-row gap-2">
          {[1, 2, 3, 4].map((s) => (
            <View key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-brand' : 'bg-gray-200'}`} />
          ))}
        </View>

        {step === 1 ? (
          <Card>
            <SectionHeader title="Step 1 · Subject & template" />
            <View className="gap-3">
              <Input label="Campaign name" value={name} onChangeText={setName} placeholder="Talent Pool Nurture" />
              <Input label="Subject" value={subject} onChangeText={setSubject} placeholder="Exciting role at Acme" />
            </View>
          </Card>
        ) : null}

        {step === 2 ? (
          <Card>
            <SectionHeader title="Step 2 · Body" />
            <Input label="Email body" value={body} onChangeText={setBody} multiline placeholder="Hi {{name}}, …" />
          </Card>
        ) : null}

        {step === 3 ? (
          <Card>
            <SectionHeader title="Step 3 · Recipients" />
            <Text className="text-3xl font-extrabold text-navy-900">{recipientCount}</Text>
            <Text className="mt-1 text-sm text-gray-500">recipients (unsubscribes auto-excluded)</Text>
          </Card>
        ) : null}

        {step === 4 ? (
          <Card>
            <SectionHeader title="Step 4 · Confirm" />
            <StatRow label="Name" value={name || subject} />
            <StatRow label="Subject" value={subject} />
            <StatRow label="Recipients" value={recipientCount} />
          </Card>
        ) : null}

        <View className="flex-row gap-2">
          {step > 1 ? (
            <View className="flex-1">
              <Button label="Back" variant="outline" onPress={() => setStep((s) => s - 1)} />
            </View>
          ) : null}
          {step < 4 ? (
            <View className="flex-1">
              <Button label="Next" disabled={step === 1 && subject.trim().length === 0} onPress={() => setStep((s) => s + 1)} />
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
