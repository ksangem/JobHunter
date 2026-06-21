import type { ReactNode } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Two-pane auth layout: brand panel (web wide) + form column. */
export function AuthShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 flex-row">
        {wide ? (
          <View className="flex-1 bg-navy-900 p-12 justify-between">
            <View>
              <Text className="text-3xl font-extrabold text-white">JobHunter</Text>
              <Text className="mt-1 text-sm text-brand-100">AI-powered recruitment, on any device.</Text>
            </View>
            <View className="gap-4">
              {[
                ['Explainable AI matching', 'Composite 0–100 scoring with human-in-the-loop validation.'],
                ['Compliant Voice AI outreach', '5-gate pre-call check · TRAI DNC · two-key consent.'],
                ['Enterprise-grade & auditable', 'Multi-tenant RLS · immutable 7-year audit · GDPR/DPDP.'],
              ].map(([h, s]) => (
                <View key={h} className="flex-row gap-3">
                  <View className="mt-1 h-2 w-2 rounded-full bg-brand" />
                  <View className="flex-1">
                    <Text className="font-semibold text-white">{h}</Text>
                    <Text className="text-sm text-brand-100">{s}</Text>
                  </View>
                </View>
              ))}
            </View>
            <Text className="text-xs text-brand-100">v2.0 · Universal (Web · iOS · Android)</Text>
          </View>
        ) : null}
        <View className="flex-1 items-center justify-center">
          <ScrollView className="w-full" contentContainerClassName="items-center justify-center flex-grow px-6 py-10">
            <View className="w-full max-w-sm">
              {!wide ? <Text className="mb-6 text-center text-2xl font-extrabold text-navy-900">JobHunter</Text> : null}
              <Text className="text-2xl font-extrabold text-navy-900">{title}</Text>
              {subtitle ? <Text className="mt-1 text-sm text-gray-500">{subtitle}</Text> : null}
              <View className="mt-6">{children}</View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
