import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/lib/constants';

const icon =
  (name: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: { color: string; size: number }) =>
    <Ionicons name={name} color={color} size={size} />;

export default function CandidateLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.brand,
        tabBarInactiveTintColor: COLORS.gray400,
        tabBarStyle: { borderTopColor: COLORS.gray200, height: 60, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Home', tabBarIcon: icon('home-outline') }} />
      <Tabs.Screen name="jobs" options={{ title: 'Jobs', tabBarIcon: icon('briefcase-outline') }} />
      <Tabs.Screen name="applications" options={{ title: 'Applications', tabBarIcon: icon('documents-outline') }} />
      <Tabs.Screen name="resume-ai" options={{ title: 'Resume AI', tabBarIcon: icon('sparkles-outline') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('person-outline') }} />
      {/* Non-tab routes (reachable via navigation) */}
      <Tabs.Screen name="interviews" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="cv" options={{ href: null }} />
      <Tabs.Screen name="onboarding" options={{ href: null }} />
      <Tabs.Screen name="cv-upload" options={{ href: null }} />
      <Tabs.Screen name="manual-profile" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
