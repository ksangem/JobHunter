import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { TagSelect } from '@/components/shared/TagSelect';
import { CURRENCY_OPTIONS, EMPLOYMENT_TYPES, LOCATION_OPTIONS, ROLE_CATEGORIES, SKILL_OPTIONS } from '@/lib/options';
import { useCompleteOnboardingMutation } from '@/store/api/candidateApi';

const STEPS = ['Basic', 'Skills', 'Preferences', 'Work history'];

interface Emp { company: string; role: string; start: string; end: string; current: boolean; desc: string }
const emptyEmp = (): Emp => ({ company: '', role: '', start: '', end: '', current: false, desc: '' });

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className={`rounded-full px-3 py-2 ${active ? 'bg-brand' : 'bg-white border border-gray-300'}`}>
      <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{label}</Text>
    </Pressable>
  );
}

// Ported from prototype ManualProfilePage: 4-step guided profile builder.
export default function ManualProfileWizard() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('');
  const [years, setYears] = useState('');
  const [months, setMonths] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [certs, setCerts] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [empType, setEmpType] = useState('Full-time');
  const [availability, setAvailability] = useState('');
  const [history, setHistory] = useState<Emp[]>([emptyEmp()]);

  const [completeOnboarding, { isLoading: saving }] = useCompleteOnboardingMutation();

  const canNext = [Boolean(role), skills.length > 0, locations.length > 0, true][step];

  const finish = async () => {
    await completeOnboarding({
      headline: role,
      experience_years: Number(years) || 0,
      skills: skills.map((name) => ({ name })),
      education: [],
      experiences: history.filter((h) => h.company).map((h) => ({ company: h.company, title: h.role, start: h.start, end: h.current ? null : h.end || null, summary: h.desc })),
      preferences: {
        target_roles: [role],
        target_locations: locations,
        min_salary: Number(salary) || undefined,
        currency,
      },
    } as never).unwrap().catch(() => null);
    router.replace('/(candidate)/dashboard');
  };

  const setEmp = (i: number, patch: Partial<Emp>) => setHistory((h) => h.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: 'Build profile' }} />
      <StepIndicator steps={STEPS} current={step} />

      <Card>
        {step === 0 ? (
          <View className="gap-4">
            <Text className="text-lg font-bold text-gray-900">Basic info</Text>
            <Input label="Current / target role" value={role} onChangeText={setRole} placeholder="e.g. Senior Software Engineer" />
            <View className="flex-row flex-wrap gap-2">
              {ROLE_CATEGORIES.slice(0, 8).map((r) => <Chip key={r} label={r} active={role === r} onPress={() => setRole(r)} />)}
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1"><Input label="Years" value={years} onChangeText={setYears} keyboardType="number-pad" placeholder="5" /></View>
              <View className="flex-1"><Input label="Months" value={months} onChangeText={setMonths} keyboardType="number-pad" placeholder="3" /></View>
            </View>
          </View>
        ) : null}

        {step === 1 ? (
          <View className="gap-4">
            <Text className="text-lg font-bold text-gray-900">Skills & certifications</Text>
            <TagSelect label="Skills" selected={skills} options={SKILL_OPTIONS} onChange={setSkills} placeholder="Add a skill…" max={12} />
            <TagSelect label="Certifications" selected={certs} options={[]} onChange={setCerts} placeholder="Type a certification + Enter" allowCustom />
          </View>
        ) : null}

        {step === 2 ? (
          <View className="gap-4">
            <Text className="text-lg font-bold text-gray-900">Preferences</Text>
            <TagSelect label="Preferred locations" selected={locations} options={LOCATION_OPTIONS} onChange={setLocations} placeholder="Add a location…" />
            <View className="flex-row gap-3">
              <View className="flex-1"><Input label="Expected salary" value={salary} onChangeText={setSalary} keyboardType="number-pad" placeholder="2800000" /></View>
            </View>
            <View>
              <Text className="mb-1.5 text-sm font-medium text-gray-700">Currency</Text>
              <View className="flex-row flex-wrap gap-2">{CURRENCY_OPTIONS.map((c) => <Chip key={c} label={c} active={currency === c} onPress={() => setCurrency(c)} />)}</View>
            </View>
            <View>
              <Text className="mb-1.5 text-sm font-medium text-gray-700">Employment type</Text>
              <View className="flex-row flex-wrap gap-2">{EMPLOYMENT_TYPES.map((t) => <Chip key={t} label={t} active={empType === t} onPress={() => setEmpType(t)} />)}</View>
            </View>
            <Input label="Availability" value={availability} onChangeText={setAvailability} placeholder="e.g. Immediate (15-day notice)" />
          </View>
        ) : null}

        {step === 3 ? (
          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Work history</Text>
              <Button label="+ Add" size="sm" variant="outline" onPress={() => setHistory((h) => [...h, emptyEmp()])} />
            </View>
            {history.map((e, i) => (
              <View key={i} className="gap-3 rounded-xl border border-gray-200 p-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-gray-600">Position {i + 1}</Text>
                  {history.length > 1 ? <Pressable onPress={() => setHistory((h) => h.filter((_, idx) => idx !== i))}><Text className="text-xs font-semibold text-danger">Remove</Text></Pressable> : null}
                </View>
                <Input label="Company" value={e.company} onChangeText={(v) => setEmp(i, { company: v })} />
                <Input label="Role" value={e.role} onChangeText={(v) => setEmp(i, { role: v })} />
                <View className="flex-row gap-3">
                  <View className="flex-1"><Input label="Start (YYYY-MM)" value={e.start} onChangeText={(v) => setEmp(i, { start: v })} placeholder="2023-05" /></View>
                  <View className="flex-1"><Input label="End" value={e.current ? 'Present' : e.end} onChangeText={(v) => setEmp(i, { end: v })} editable={!e.current} placeholder="2025-01" /></View>
                </View>
                <Pressable onPress={() => setEmp(i, { current: !e.current })} className="flex-row items-center gap-2">
                  <View className={`h-5 w-5 items-center justify-center rounded ${e.current ? 'bg-brand' : 'border border-gray-300'}`}>{e.current ? <Text className="text-xs font-bold text-white">✓</Text> : null}</View>
                  <Text className="text-sm text-gray-600">I currently work here</Text>
                </Pressable>
                <Input label="Summary" value={e.desc} onChangeText={(v) => setEmp(i, { desc: v })} multiline numberOfLines={3} />
              </View>
            ))}
          </View>
        ) : null}
      </Card>

      <View className="mt-4 flex-row gap-3">
        {step > 0 ? <View className="flex-1"><Button label="Back" variant="outline" onPress={() => setStep((s) => s - 1)} /></View> : null}
        <View className="flex-1">
          {step < STEPS.length - 1 ? (
            <Button label="Next" onPress={() => setStep((s) => s + 1)} disabled={!canNext} />
          ) : (
            <Button label="Create profile" onPress={finish} loading={saving} />
          )}
        </View>
      </View>
    </Screen>
  );
}
