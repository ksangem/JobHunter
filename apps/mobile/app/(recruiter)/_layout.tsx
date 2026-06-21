import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/lib/constants';

const icon =
  (name: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: { color: string; size: number }) =>
    <Ionicons name={name} color={color} size={size} />;

export default function RecruiterLayout() {
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
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: icon('grid-outline') }} />
      <Tabs.Screen name="pipeline" options={{ title: 'Pipeline', tabBarIcon: icon('git-network-outline') }} />
      <Tabs.Screen name="jds" options={{ title: 'Jobs', tabBarIcon: icon('document-text-outline') }} />
      <Tabs.Screen name="voice-ai" options={{ title: 'Voice AI', tabBarIcon: icon('call-outline') }} />
      <Tabs.Screen name="interviews" options={{ title: 'Interviews', tabBarIcon: icon('calendar-outline') }} />
      <Tabs.Screen name="analytics" options={{ title: 'Analytics', tabBarIcon: icon('bar-chart-outline') }} />
      <Tabs.Screen name="email" options={{ href: null }} />
      <Tabs.Screen name="market-intel" options={{ href: null }} />
      <Tabs.Screen name="onboarding" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
