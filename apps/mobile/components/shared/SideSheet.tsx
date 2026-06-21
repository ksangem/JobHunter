// Universal overlay panel. Renders as a right-side drawer on wide screens
// (web/tablet) and a bottom sheet on narrow screens (mobile). Uses RN Modal so
// it works identically on web + native (the prescribed platform-split would use
// a native BottomSheet + web Drawer; this single impl keeps the demo simple).
import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

interface SideSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function SideSheet({ visible, onClose, title, children }: SideSheetProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 768;
  return (
    <Modal visible={visible} transparent animationType={wide ? 'fade' : 'slide'} onRequestClose={onClose}>
      <View className={`flex-1 bg-black/40 ${wide ? 'flex-row justify-end' : 'justify-end'}`}>
        <Pressable className="absolute inset-0" onPress={onClose} />
        <View className={`bg-gray-50 ${wide ? 'h-full w-[460px]' : 'max-h-[88%] rounded-t-3xl'}`}>
          <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-4">
            <Text className="text-lg font-bold text-navy-900">{title}</Text>
            <Pressable onPress={onClose} className="h-8 w-8 items-center justify-center rounded-full bg-gray-200 active:opacity-70">
              <Text className="text-base font-bold text-gray-600">✕</Text>
            </Pressable>
          </View>
          <ScrollView className="flex-1" contentContainerClassName="p-4">
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
