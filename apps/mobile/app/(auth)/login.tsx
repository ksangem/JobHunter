import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AuthShell } from '@/components/shared/AuthShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLoginMutation } from '@/store/api/authApi';
import { useAuth } from '@/hooks/useAuth';

const DEMO = [
  { label: 'Job Seeker', email: 'aarav@example.com', tone: 'bg-brand-50 text-brand-700' },
  { label: 'Recruiter', email: 'priya@acme.com', tone: 'bg-navy-100 text-navy-700' },
  { label: 'Admin', email: 'root@jobhunter.io', tone: 'bg-success-100 text-success' },
];

export default function LoginScreen() {
  const [email, setEmail] = useState('aarav@example.com');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const { completeLogin } = useAuth();

  const onSubmit = async () => {
    setError(null);
    try {
      const res = await login({ email, password }).unwrap();
      if (res.mfa_required && res.temp_token) {
        router.push({ pathname: '/(auth)/mfa', params: { temp_token: res.temp_token } });
        return;
      }
      if (res.tokens && res.user) await completeLogin(res.tokens, res.user);
    } catch (e: any) {
      setError(e?.data?.title ?? 'Login failed');
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your JobHunter account">
      <View className="gap-4">
        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@company.com" />
        <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" error={error ?? undefined} />
        <Button label="Sign in" onPress={onSubmit} loading={isLoading} fullWidth />

        <View className="mt-2">
          <Text className="mb-2 text-center text-xs font-medium text-gray-400">Demo logins (password: Password@123)</Text>
          <View className="flex-row justify-center gap-2">
            {DEMO.map((d) => {
              const [bg, text] = d.tone.split(' ');
              return (
                <Pressable key={d.label} onPress={() => { setEmail(d.email); setPassword('Password@123'); }} className={`rounded-lg px-3 py-2 ${bg}`}>
                  <Text className={`text-xs font-semibold ${text}`}>{d.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-2 flex-row justify-center gap-1">
          <Text className="text-sm text-gray-500">No account?</Text>
          <Text className="text-sm font-semibold text-brand" onPress={() => router.push('/(auth)/register')}>
            Create one
          </Text>
        </View>
      </View>
    </AuthShell>
  );
}
