import { useState } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AuthShell } from '@/components/shared/AuthShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useVerifyEmailMutation } from '@/store/api/authApi';
import { useAuth } from '@/hooks/useAuth';

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verify, { isLoading }] = useVerifyEmailMutation();
  const { completeLogin } = useAuth();

  const onSubmit = async () => {
    setError(null);
    try {
      const res = await verify({ email: email ?? '', otp }).unwrap();
      // New candidates go through profile onboarding first.
      await completeLogin(res.tokens, res.user, '/(candidate)/onboarding');
    } catch (e: any) {
      setError(e?.data?.title ?? 'Verification failed');
    }
  };

  return (
    <AuthShell title="Verify your email" subtitle={`We sent a 6-digit OTP to ${email ?? 'your inbox'} (valid 10 min)`}>
      <View className="gap-4">
        <Input label="OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} placeholder="123456" error={error ?? undefined} hint="Demo: any 6 digits" />
        <Button label="Verify & continue" onPress={onSubmit} loading={isLoading} disabled={otp.length !== 6} fullWidth />
        <Text className="text-center text-xs text-gray-400">Resend available in 60s · max 3 / hour</Text>
        <Text className="text-center text-sm font-semibold text-brand" onPress={() => router.replace('/(auth)/login')}>
          Back to sign in
        </Text>
      </View>
    </AuthShell>
  );
}
