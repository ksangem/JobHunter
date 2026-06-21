import { useState } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AuthShell } from '@/components/shared/AuthShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useVerifyMfaMutation } from '@/store/api/authApi';
import { useAuth } from '@/hooks/useAuth';

export default function MfaScreen() {
  const { temp_token } = useLocalSearchParams<{ temp_token: string }>();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifyMfa, { isLoading }] = useVerifyMfaMutation();
  const { completeLogin } = useAuth();

  const onSubmit = async () => {
    setError(null);
    try {
      const res = await verifyMfa({ temp_token: temp_token ?? '', totp_code: code }).unwrap();
      await completeLogin(res.tokens, res.user);
    } catch (e: any) {
      setError(e?.data?.title ?? 'Invalid code');
    }
  };

  return (
    <AuthShell title="Two-factor authentication" subtitle="Enter the 6-digit code from your authenticator app">
      <View className="gap-4">
        <Input label="Authentication code" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} placeholder="000000" error={error ?? undefined} hint="Demo: any 6 digits" />
        <Button label="Verify" onPress={onSubmit} loading={isLoading} disabled={code.length !== 6} fullWidth />
        <Text className="text-center text-sm font-semibold text-brand" onPress={() => router.replace('/(auth)/login')}>
          Use a different account
        </Text>
      </View>
    </AuthShell>
  );
}
