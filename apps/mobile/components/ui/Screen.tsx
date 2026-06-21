import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  /** Wrap content in a ScrollView (default true). */
  scroll?: boolean;
  /** Center content in a max-width column on wide screens (web/tablet). */
  contained?: boolean;
  padded?: boolean;
}

/**
 * Universal page shell: safe-area aware, optional scroll, and a responsive
 * max-width container so the web layout doesn't stretch edge-to-edge.
 */
export function Screen({ children, scroll = true, contained = true, padded = true }: ScreenProps) {
  const inner = (
    <View className={`w-full ${contained ? 'max-w-5xl mx-auto' : ''} ${padded ? 'px-4 py-5' : ''}`}>
      {children}
    </View>
  );
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          showsVerticalScrollIndicator={false}
        >
          {inner}
        </ScrollView>
      ) : (
        <View className="flex-1">{inner}</View>
      )}
    </SafeAreaView>
  );
}
