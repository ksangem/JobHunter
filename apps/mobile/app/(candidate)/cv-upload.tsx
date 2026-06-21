import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { TagSelect } from '@/components/shared/TagSelect';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { COLORS } from '@/lib/constants';
import { LOCATION_OPTIONS, SKILL_OPTIONS } from '@/lib/options';
import { useUploadCvMutation, useCompleteOnboardingMutation } from '@/store/api/candidateApi';

const STEPS = ['Upload', 'AI Parsing', 'Review', 'Done'];
const PARSE_MESSAGES = ['Extracting text…', 'Identifying skills…', 'Parsing experience…', 'Scoring resume…'];

// Ported from prototype CVUploadPage: 4-step upload → AI parse → review → done.
export default function CvUploadWizard() {
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  // parsed/review fields (pre-filled to simulate AI extraction)
  const [currentRole, setCurrentRole] = useState('Senior Software Engineer');
  const [skills, setSkills] = useState<string[]>(['React', 'Node.js', 'TypeScript', 'AWS']);
  const [years, setYears] = useState('5');
  const [locations, setLocations] = useState<string[]>(['Bangalore', 'Remote']);

  const [uploadCv] = useUploadCvMutation();
  const [completeOnboarding, { isLoading: saving }] = useCompleteOnboardingMutation();

  // Step 2: simulate parsing
  useEffect(() => {
    if (step !== 1) return;
    setProgress(0);
    const p = setInterval(() => setProgress((v) => Math.min(100, v + 10)), 250);
    const m = setInterval(() => setMsgIdx((i) => (i + 1) % PARSE_MESSAGES.length), 600);
    const done = setTimeout(() => setStep(2), 2800);
    return () => { clearInterval(p); clearInterval(m); clearTimeout(done); };
  }, [step]);

  const onPickFile = () => {
    // Web: HTML input[type=file]; native: expo-document-picker (platform split per BRD).
    // For the demo we simulate a selected file.
    setFileName('Resume_2026.pdf');
  };

  const startParse = async () => {
    if (fileName) await uploadCv({ filename: fileName, size_bytes: 240000 }).unwrap().catch(() => null);
    setStep(1);
  };

  const confirm = async () => {
    await completeOnboarding({
      headline: currentRole,
      skills: skills.map((name) => ({ name })),
      experience_years: Number(years) || 0,
      preferences: { target_roles: [currentRole], target_locations: locations },
    } as never).unwrap().catch(() => null);
    setStep(3);
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: 'Upload CV' }} />
      <StepIndicator steps={STEPS} current={step} />

      {step === 0 ? (
        <Card>
          <Text className="text-lg font-bold text-gray-900">Upload your resume</Text>
          <Text className="mt-1 text-sm text-gray-500">PDF, DOCX or TXT · up to 10MB · ClamAV scanned before processing.</Text>
          <Pressable onPress={onPickFile} className="mt-4 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 py-10 active:bg-gray-100">
            <Ionicons name={fileName ? 'document-text' : 'cloud-upload-outline'} size={36} color={COLORS.brand} />
            <Text className="mt-2 text-sm font-semibold text-gray-700">{fileName ?? 'Tap to choose a file'}</Text>
            {fileName ? <Text className="mt-0.5 text-xs text-gray-400">Tap to replace</Text> : <Text className="mt-0.5 text-xs text-gray-400">or drag & drop (web)</Text>}
          </Pressable>
          {fileName ? (
            <Pressable onPress={() => setFileName(null)} className="mt-2 self-start"><Text className="text-xs font-semibold text-danger">Remove file</Text></Pressable>
          ) : null}
          <View className="mt-5"><Button label="Continue" onPress={startParse} disabled={!fileName} fullWidth /></View>
        </Card>
      ) : null}

      {step === 1 ? (
        <Card>
          <View className="items-center py-8">
            <Ionicons name="sparkles" size={36} color={COLORS.brand} />
            <Text className="mt-3 text-lg font-bold text-gray-900">Parsing your resume…</Text>
            <Text className="mt-1 text-sm text-gray-500">{PARSE_MESSAGES[msgIdx]}</Text>
            <View className="mt-5 w-full max-w-sm"><ProgressBar value={progress} /></View>
            <Text className="mt-2 text-xs text-gray-400">{progress}%</Text>
          </View>
        </Card>
      ) : null}

      {step === 2 ? (
        <View className="gap-4">
          <Card>
            <Text className="text-lg font-bold text-gray-900">Review extracted details</Text>
            <Text className="mt-1 text-sm text-gray-500">AI pre-filled these from your CV — edit anything that's off. Low-confidence fields are never auto-applied.</Text>
            <View className="mt-4 gap-4">
              <Input label="Current role" value={currentRole} onChangeText={setCurrentRole} />
              <Input label="Years of experience" value={years} onChangeText={setYears} keyboardType="number-pad" />
              <TagSelect label="Skills" selected={skills} options={SKILL_OPTIONS} onChange={setSkills} placeholder="Add a skill…" />
              <TagSelect label="Preferred locations" selected={locations} options={LOCATION_OPTIONS} onChange={setLocations} placeholder="Add a location…" />
            </View>
          </Card>
          <Button label="Confirm profile" onPress={confirm} loading={saving} disabled={!locations.length} fullWidth />
        </View>
      ) : null}

      {step === 3 ? (
        <Card>
          <View className="items-center py-8">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-success-100">
              <Ionicons name="checkmark" size={32} color={COLORS.success} />
            </View>
            <Text className="mt-3 text-lg font-bold text-gray-900">Profile ready!</Text>
            <Text className="mt-1 text-center text-sm text-gray-500">Your CV was parsed and scored. You can refine it anytime.</Text>
            <View className="mt-4"><ScoreRing score={87} label="ATS" /></View>
            <View className="mt-5 w-full max-w-sm"><Button label="Go to dashboard" onPress={() => router.replace('/(candidate)/dashboard')} fullWidth /></View>
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}
