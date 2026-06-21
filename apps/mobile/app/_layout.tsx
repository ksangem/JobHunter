import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { store } from '@/store';
import { COLORS } from '@/lib/constants';

const theme = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme.colors, primary: COLORS.brand, secondary: COLORS.navy900 },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.gray50 } }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(candidate)" />
              <Stack.Screen name="(recruiter)" />
              <Stack.Screen name="(admin)" />
            </Stack>
          </PaperProvider>
        </SafeAreaProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}
