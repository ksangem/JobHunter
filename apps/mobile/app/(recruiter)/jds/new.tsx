import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { WorkMode } from '@jobhunter/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Screen } from '@/components/ui/Screen';
import { useCreateJdMutation, useUploadJdMutation } from '@/store/api/recruiterApi';

function errText(e: unknown): string {
  const err = (e as { data?: { title?: string; detail?: string } })?.data;
  return err?.detail ?? err?.title ?? 'Something went wrong.';
}

export default function NewJdScreen() {
  const [createJd, { isLoading: creating }] = useCreateJdMutation();
  const [uploadJd, { isLoading: uploading }] = useUploadJdMutation();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState<WorkMode>(WorkMode.HYBRID);
  const [expMin, setExpMin] = useState('');
  const [skillsRaw, setSkillsRaw] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [description, setDescription] = useState('');

  const [extracted, setExtracted] = useState<Record<string, unknown> | null>(null);
  const [lowConf, setLowConf] = useState<string[]>([]);
  const [banner, setBanner] = useState<string | null>(null);

  const skills = skillsRaw.split(',').map((s) => s.trim()).filter(Boolean);
  const canSubmit = title.trim().length > 0 && skills.length >= 3 && closeDate.trim().length > 0;

  const onUpload = async () => {
    setBanner(null);
    try {
      const res = await uploadJd({ filename: 'jd_upload.pdf' }).unwrap();
      setExtracted(res.extracted);
      const ex = res.extracted as { title?: string; skills?: string[]; exp_min?: number; location?: string; low_confidence_fields?: string[] };
      if (ex.title) setTitle(ex.title);
      if (ex.location) setLocation(ex.location);
      if (ex.exp_min !== undefined) setExpMin(String(ex.exp_min));
      if (ex.skills) setSkillsRaw(ex.skills.join(', '));
      setLowConf(ex.low_confidence_fields ?? []);
      setBanner(`Extracted at ${Math.round(res.extraction_confidence * 100)}% confidence. Review flagged fields before submitting.`);
    } catch (e) {
      setBanner(errText(e));
    }
  };

  const onSubmit = async () => {
    setBanner(null);
    try {
      const jd = await createJd({
        title: title.trim(),
        location: location.trim(),
        work_mode: workMode,
        exp_min: expMin ? Number(expMin) : 0,
        skills,
        salary_min: salaryMin ? Number(salaryMin) : undefined,
        salary_max: salaryMax ? Number(salaryMax) : undefined,
        expected_close_date: closeDate.trim(),
        description: description.trim() || undefined,
      }).unwrap();
      router.replace(`/(recruiter)/jds/${jd.id}`);
    } catch (e) {
      setBanner(errText(e));
    }
  };

  const flagged = (field: string) => (lowConf.includes(field) ? ' ⚠' : '');

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: true, title: 'New JD' }} />
      <Screen>
        <View className="gap-4">
          {/* AI upload */}
          <Card>
            <SectionHeader title="Upload JD document" subtitle="AI extracts fields — low-confidence fields are flagged ⚠" />
            <Button label="Upload JD document (AI extract)" variant="secondary" loading={uploading} onPress={onUpload} />
            {extracted ? (
              <View className="mt-3 rounded-xl bg-gray-50 p-3">
                <Text className="text-xs font-semibold text-gray-500">Extracted preview</Text>
                {Object.entries(extracted)
                  .filter(([k]) => k !== 'low_confidence_fields')
                  .map(([k, v]) => (
                    <View key={k} className="mt-1.5 flex-row items-center gap-2">
                      <Text className="text-xs text-gray-500">{k}:</Text>
                      <Text className={`flex-1 text-xs ${lowConf.includes(k) ? 'text-warning font-semibold' : 'text-gray-800'}`}>
                        {Array.isArray(v) ? v.join(', ') : String(v)}
                        {flagged(k)}
                      </Text>
                    </View>
                  ))}
              </View>
            ) : null}
          </Card>

          {banner ? (
            <View className="rounded-xl border border-info-100 bg-info-50 px-3 py-2">
              <Text className="text-sm font-medium text-info">{banner}</Text>
            </View>
          ) : null}

          {/* Form */}
          <Card>
            <SectionHeader title="Details" />
            <View className="gap-3">
              <Input label={`Title${flagged('title')}`} value={title} onChangeText={setTitle} placeholder="Senior Java Developer" />
              <Input label={`Location${flagged('location')}`} value={location} onChangeText={setLocation} placeholder="Bengaluru, IN" />

              <View>
                <Text className="mb-1.5 text-sm font-medium text-gray-700">Work mode</Text>
                <View className="flex-row gap-2">
                  {Object.values(WorkMode).map((wm) => {
                    const active = wm === workMode;
                    return (
                      <Pressable
                        key={wm}
                        onPress={() => setWorkMode(wm)}
                        className={`rounded-full px-3.5 py-2 ${active ? 'bg-brand' : 'bg-white border border-gray-300'}`}
                      >
                        <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{wm}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Input label={`Minimum experience (yrs)${flagged('exp_min')}`} value={expMin} onChangeText={setExpMin} keyboardType="number-pad" placeholder="5" />
              <Input
                label="Skills (comma-separated, ≥3)"
                value={skillsRaw}
                onChangeText={setSkillsRaw}
                placeholder="Java, Spring Boot, Kafka"
                error={skillsRaw.length > 0 && skills.length < 3 ? 'At least 3 skills required.' : undefined}
                hint={`${skills.length} skill${skills.length === 1 ? '' : 's'}`}
              />
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Input label={`Salary min${flagged('salary_min')}`} value={salaryMin} onChangeText={setSalaryMin} keyboardType="number-pad" placeholder="2500000" />
                </View>
                <View className="flex-1">
                  <Input label={`Salary max${flagged('salary_max')}`} value={salaryMax} onChangeText={setSalaryMax} keyboardType="number-pad" placeholder="3500000" />
                </View>
              </View>
              <Input
                label="Expected close date (yyyy-mm-dd)"
                value={closeDate}
                onChangeText={setCloseDate}
                placeholder="2026-08-31"
                error={closeDate.length > 0 && closeDate.trim().length < 8 ? 'Enter a valid date.' : undefined}
              />
              <Input label="Description" value={description} onChangeText={setDescription} multiline placeholder="Role summary…" />
            </View>
          </Card>

          {!canSubmit ? (
            <View className="self-start">
              <Badge label="Need ≥3 skills + close date to submit" tone="warning" />
            </View>
          ) : null}

          <Button label="Create JD" loading={creating} disabled={!canSubmit} onPress={onSubmit} fullWidth />
        </View>
      </Screen>
    </View>
  );
}
