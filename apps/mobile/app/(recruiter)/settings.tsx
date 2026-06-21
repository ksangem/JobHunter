import { useState } from 'react';
import { Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Loader } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TopBar } from '@/components/shared/TopBar';
import { useGetMyOrgQuery, useUpsertOrgMutation, useSaveRecruiterSettingsMutation } from '@/store/api/recruiterApi';
import { useListUsersQuery } from '@/store/api/adminApi';

function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
      <View className="flex-1 pr-3">
        <Text className="text-sm font-medium text-gray-800">{label}</Text>
        <Text className="text-xs text-gray-400">{desc}</Text>
      </View>
      <Toggle value={value} onChange={onChange} />
    </View>
  );
}

// Ported from prototype RecruiterSettingsPage: org profile, team, AI config, notifications.
export default function RecruiterSettings() {
  const { data: org, isLoading } = useGetMyOrgQuery();
  const { data: users } = useListUsersQuery();
  const [upsertOrg] = useUpsertOrgMutation();
  const [save, { isLoading: saving }] = useSaveRecruiterSettingsMutation();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [ai, setAi] = useState({ autoShortlist: true, confidence: 70 });
  const [notif, setNotif] = useState({ newCandidates: true, interviewReminders: true, campaignUpdates: true, weeklyReport: false });

  // hydrate once org loads
  const orgName = name || org?.name || '';
  const team = (users ?? []).filter((u) => u.org_id === org?.id);

  const onSave = async () => {
    await Promise.all([
      upsertOrg({ name: orgName, industry: industry || undefined, location: location || undefined }).unwrap().catch(() => null),
      save({ ai, notifications: notif }).unwrap().catch(() => null),
    ]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Settings" />
      <Screen>
        {isLoading ? (
          <Loader />
        ) : (
          <View className="gap-4">
            {/* Org profile */}
            <Card>
              <SectionHeader title="Organisation profile" />
              <View className="gap-3">
                <Input label="Company name" value={orgName} onChangeText={setName} />
                <Input label="Industry" value={industry || org?.tier || ''} onChangeText={setIndustry} />
                <Input label="Location" value={location || org?.region || ''} onChangeText={setLocation} />
                <View className="flex-row items-center gap-2">
                  <Badge label={`Seats ${org?.seats_filled ?? 0}/${org?.seats_total ?? 0}`} tone="navy" />
                  <Badge label={org?.dpa_signed_at ? 'DPA signed' : 'DPA pending'} tone={org?.dpa_signed_at ? 'success' : 'danger'} />
                </View>
              </View>
            </Card>

            {/* Team management */}
            <Card>
              <SectionHeader title="Team management" action={<Text className="text-sm font-semibold text-brand">Invite</Text>} />
              {team.length ? team.map((u) => (
                <View key={u.id} className="flex-row items-center gap-3 border-b border-gray-100 py-2.5">
                  <Avatar name={u.full_name} size="sm" />
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-900">{u.full_name}</Text>
                    <Text className="text-xs text-gray-400">{u.email}</Text>
                  </View>
                  <Badge label={u.role} tone="navy" />
                </View>
              )) : <Text className="py-2 text-sm text-gray-400">No team members yet.</Text>}
            </Card>

            {/* AI config */}
            <Card>
              <SectionHeader title="AI configuration" />
              <ToggleRow label="Auto-generate AI shortlist" desc="Rank new candidates automatically (advisory until human approve)" value={ai.autoShortlist} onChange={(v) => setAi({ ...ai, autoShortlist: v })} />
              <View className="py-3">
                <View className="flex-row justify-between"><Text className="text-sm font-medium text-gray-800">Confidence threshold</Text><Text className="text-sm font-semibold text-brand">{ai.confidence}%</Text></View>
                <Text className="mb-2 text-xs text-gray-400">Fields below this are flagged for manual review (never auto-filled).</Text>
                <ProgressBar value={ai.confidence} />
                <View className="mt-2 flex-row gap-2">
                  <Button label="−5" size="sm" variant="outline" onPress={() => setAi({ ...ai, confidence: Math.max(50, ai.confidence - 5) })} />
                  <Button label="+5" size="sm" variant="outline" onPress={() => setAi({ ...ai, confidence: Math.min(95, ai.confidence + 5) })} />
                </View>
              </View>
            </Card>

            {/* Notifications */}
            <Card>
              <SectionHeader title="Notifications" />
              <ToggleRow label="New candidate matches" desc="When candidates match your JDs" value={notif.newCandidates} onChange={(v) => setNotif({ ...notif, newCandidates: v })} />
              <ToggleRow label="Interview reminders" desc="30 min before interviews" value={notif.interviewReminders} onChange={(v) => setNotif({ ...notif, interviewReminders: v })} />
              <ToggleRow label="Campaign updates" desc="Voice & email campaign progress" value={notif.campaignUpdates} onChange={(v) => setNotif({ ...notif, campaignUpdates: v })} />
              <ToggleRow label="Weekly report" desc="Weekly hiring performance summary" value={notif.weeklyReport} onChange={(v) => setNotif({ ...notif, weeklyReport: v })} />
            </Card>

            {saved ? <Text className="text-center text-sm font-semibold text-success">✓ Settings saved</Text> : null}
            <Button label="Save settings" onPress={onSave} loading={saving} fullWidth />
          </View>
        )}
      </Screen>
    </View>
  );
}
