import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { COLORS } from '@/lib/constants';
import { INDUSTRY_OPTIONS, ORG_SIZE_OPTIONS } from '@/lib/options';
import { useUpsertOrgMutation } from '@/store/api/recruiterApi';

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className={`rounded-full px-3 py-2 ${active ? 'bg-brand' : 'bg-white border border-gray-300'}`}>
      <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{label}</Text>
    </Pressable>
  );
}

// Ported from prototype OrgOnboardingPage: company setup before using the app.
export default function RecruiterOnboarding() {
  const [form, setForm] = useState({ name: '', industry: '', size: '', location: '', domain: '' });
  const [upsertOrg, { isLoading }] = useUpsertOrgMutation();
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.name && form.industry && form.size && form.location;

  const submit = async () => {
    await upsertOrg({ name: form.name, industry: form.industry, size: form.size, location: form.location, domain: form.domain }).unwrap().catch(() => null);
    router.replace('/(recruiter)/dashboard');
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: 'Organisation setup' }} />
      <View className="items-center py-3">
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-navy-100">
          <Ionicons name="business" size={28} color={COLORS.navy700} />
        </View>
        <Text className="mt-3 text-2xl font-extrabold text-navy-900">Set up your organisation</Text>
        <Text className="mt-1 text-center text-sm text-gray-500">A few details so we can provision seats and start sourcing. JD publishing unlocks once your DPA is signed.</Text>
      </View>

      <Card>
        <View className="gap-4">
          <Input label="Company name" value={form.name} onChangeText={(v) => set('name', v)} placeholder="e.g. Nalashaa Digital" />
          <View>
            <Text className="mb-1.5 text-sm font-medium text-gray-700">Industry</Text>
            <View className="flex-row flex-wrap gap-2">{INDUSTRY_OPTIONS.map((o) => <Chip key={o} label={o} active={form.industry === o} onPress={() => set('industry', o)} />)}</View>
          </View>
          <View>
            <Text className="mb-1.5 text-sm font-medium text-gray-700">Company size</Text>
            <View className="flex-row flex-wrap gap-2">{ORG_SIZE_OPTIONS.map((o) => <Chip key={o} label={o} active={form.size === o} onPress={() => set('size', o)} />)}</View>
          </View>
          <Input label="Location" value={form.location} onChangeText={(v) => set('location', v)} placeholder="e.g. Ahmedabad, India" />
          <Input label="Domain" value={form.domain} onChangeText={(v) => set('domain', v)} autoCapitalize="none" placeholder="e.g. nalashaa.com" />
        </View>
      </Card>

      <View className="mt-4">
        <Button label="Continue to dashboard" onPress={submit} loading={isLoading} disabled={!valid} fullWidth />
      </View>
    </Screen>
  );
}
