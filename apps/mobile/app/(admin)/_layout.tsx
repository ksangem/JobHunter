import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/lib/constants';

const icon =
  (name: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: { color: string; size: number }) =>
    <Ionicons name={name} color={color} size={size} />;

export default function AdminLayout() {
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
      <Tabs.Screen name="organisations" options={{ title: 'Orgs', tabBarIcon: icon('business-outline') }} />
      <Tabs.Screen name="users" options={{ title: 'Users', tabBarIcon: icon('people-outline') }} />
      <Tabs.Screen name="ai-monitoring" options={{ title: 'AI Monitor', tabBarIcon: icon('pulse-outline') }} />
      <Tabs.Screen name="audit" options={{ title: 'Audit', tabBarIcon: icon('shield-checkmark-outline') }} />
    </Tabs>
  );
}
