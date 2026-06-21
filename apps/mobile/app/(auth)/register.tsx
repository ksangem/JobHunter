import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { AuthShell } from '@/components/shared/AuthShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRegisterMutation } from '@/store/api/authApi';

// Password policy (FR-JS-001): min 12 chars, upper/lower/digit/symbol.
function passwordIssue(p: string): string | null {
  if (p.length < 12) return 'At least 12 characters';
  if (!/[A-Z]/.test(p)) return 'Add an uppercase letter';
  if (!/[a-z]/.test(p)) return 'Add a lowercase letter';
  if (!/[0-9]/.test(p)) return 'Add a digit';
  if (!/[^A-Za-z0-9]/.test(p)) return 'Add a symbol';
  return null;
}

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, { isLoading }] = useRegisterMutation();

  const pwIssue = password ? passwordIssue(password) : null;
  const canSubmit = fullName && email && password && !pwIssue;

  const onSubmit = async () => {
    await register({ full_name: fullName, email, password, role: 'CANDIDATE' }).unwrap().catch(() => null);
    router.push({ pathname: '/(auth)/verify-email', params: { email } });
  };

  return (
    <AuthShell title="Create your account" subtitle="Job seekers — start your AI-assisted job hunt">
      <View className="gap-4">
        <Input label="Full name" value={fullName} onChangeText={setFullName} placeholder="Aarav Sharma" />
        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="At least 12 characters"
          error={pwIssue ?? undefined}
          hint="12+ chars · upper, lower, digit & symbol"
        />
        <Button label="Continue" onPress={onSubmit} loading={isLoading} disabled={!canSubmit} fullWidth />
        <View className="mt-1 flex-row justify-center gap-1">
          <Text className="text-sm text-gray-500">Already registered?</Text>
          <Text className="text-sm font-semibold text-brand" onPress={() => router.replace('/(auth)/login')}>
            Sign in
          </Text>
        </View>
      </View>
    </AuthShell>
  );
}
