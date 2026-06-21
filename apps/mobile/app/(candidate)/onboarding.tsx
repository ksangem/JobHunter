import { Text, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COLORS } from '@/lib/constants';

// Candidate profile-creation entry point (ported from prototype OnboardingPage):
// pick CV upload (AI parse) or manual entry. Reachable after register and anytime.
export default function CandidateOnboarding() {
  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: 'Get started' }} />
      <View className="items-center py-4">
        <Text className="text-2xl font-extrabold text-navy-900">Build your profile</Text>
        <Text className="mt-1 text-center text-sm text-gray-500">Choose how you'd like to create your JobHunter profile.</Text>
      </View>

      <View className="mt-2 flex-row flex-wrap gap-4">
        <Card onPress={() => router.push('/(candidate)/cv-upload')} className="flex-1 min-w-[260px] items-center py-6">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
            <Ionicons name="cloud-upload-outline" size={28} color={COLORS.brand} />
          </View>
          <Text className="mt-3 text-lg font-bold text-gray-900">Upload my CV</Text>
          <Text className="mt-1 text-center text-sm text-gray-500">Let AI parse your resume and pre-fill everything. PDF, DOCX or TXT · ~30s.</Text>
          <View className="mt-4 w-full"><Button label="Upload CV" onPress={() => router.push('/(candidate)/cv-upload')} fullWidth /></View>
        </Card>

        <Card onPress={() => router.push('/(candidate)/manual-profile')} className="flex-1 min-w-[260px] items-center py-6">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-navy-100">
            <Ionicons name="create-outline" size={28} color={COLORS.navy700} />
          </View>
          <Text className="mt-3 text-lg font-bold text-gray-900">Enter manually</Text>
          <Text className="mt-1 text-center text-sm text-gray-500">Fill a guided 4-step form. Best if you don't have a CV handy · ~5 min.</Text>
          <View className="mt-4 w-full"><Button label="Build manually" variant="outline" onPress={() => router.push('/(candidate)/manual-profile')} fullWidth /></View>
        </Card>
      </View>

      <View className="mt-6 items-center">
        <Button label="Skip for now → Dashboard" variant="ghost" onPress={() => router.replace('/(candidate)/dashboard')} />
      </View>
    </Screen>
  );
}
