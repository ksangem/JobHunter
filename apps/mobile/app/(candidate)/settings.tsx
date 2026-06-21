import { useState } from 'react';
import { Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TopBar } from '@/components/shared/TopBar';
import { useGetMeQuery, useSaveSettingsMutation } from '@/store/api/candidateApi';

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

// Ported from prototype SettingsPage (candidate): account, notifications, privacy.
export default function CandidateSettings() {
  const { data: me } = useGetMeQuery();
  const [save, { isLoading }] = useSaveSettingsMutation();
  const [saved, setSaved] = useState(false);

  const [email, setEmail] = useState(me?.email ?? 'aarav@example.com');
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [prefs, setPrefs] = useState({ emailNotifications: true, jobAlerts: true, interviewReminders: true, voiceAIConsent: false });
  const [profileVisible, setProfileVisible] = useState(true);

  const onSave = async () => {
    await save({ email, prefs, profileVisible }).unwrap().catch(() => null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Settings" bellRoute="/(candidate)/notifications" />
      <Screen>
        <View className="gap-4">
          <Card>
            <SectionHeader title="Account" subtitle="Email & password" />
            <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <View className="mt-3 gap-3">
              <Input label="Current password" value={pw.current} onChangeText={(v) => setPw({ ...pw, current: v })} secureTextEntry />
              <Input label="New password" value={pw.next} onChangeText={(v) => setPw({ ...pw, next: v })} secureTextEntry hint="12+ chars · upper, lower, digit & symbol" />
              <Input label="Confirm new password" value={pw.confirm} onChangeText={(v) => setPw({ ...pw, confirm: v })} secureTextEntry error={pw.confirm && pw.next !== pw.confirm ? 'Passwords do not match' : undefined} />
            </View>
          </Card>

          <Card>
            <SectionHeader title="Notifications" />
            <ToggleRow label="Email notifications" desc="Product updates and account emails" value={prefs.emailNotifications} onChange={(v) => setPrefs({ ...prefs, emailNotifications: v })} />
            <ToggleRow label="Job alerts" desc="New roles matching your profile" value={prefs.jobAlerts} onChange={(v) => setPrefs({ ...prefs, jobAlerts: v })} />
            <ToggleRow label="Interview reminders" desc="Reminders before scheduled interviews" value={prefs.interviewReminders} onChange={(v) => setPrefs({ ...prefs, interviewReminders: v })} />
            <ToggleRow label="Voice AI consent" desc="Allow compliant AI voice outreach (VOICE_AI consent)" value={prefs.voiceAIConsent} onChange={(v) => setPrefs({ ...prefs, voiceAIConsent: v })} />
          </Card>

          <Card>
            <SectionHeader title="Privacy & data" subtitle="GDPR / DPDP rights" />
            <ToggleRow label="Profile visible to recruiters" desc="Appear in the consented candidate pool" value={profileVisible} onChange={setProfileVisible} />
            <View className="mt-3 flex-row gap-2">
              <View className="flex-1"><Button label="Export my data" variant="outline" onPress={() => {}} /></View>
              <View className="flex-1"><Button label="Delete account" variant="danger" onPress={() => {}} /></View>
            </View>
          </Card>

          {saved ? <Text className="text-center text-sm font-semibold text-success">✓ Settings saved</Text> : null}
          <Button label="Save settings" onPress={onSave} loading={isLoading} fullWidth />
        </View>
      </Screen>
    </View>
  );
}
