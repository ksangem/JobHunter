// ============================================================================
// Platform-split secure token storage (Mobile Rule §1).
// Native: expo-secure-store (Keychain/Keystore). Web: localStorage (httpOnly
// cookie is preferred in production; localStorage used for the demo SPA).
// NEVER store JWTs in AsyncStorage.
// ============================================================================
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ACCESS = 'jh.access_token';
const REFRESH = 'jh.refresh_token';

const isWeb = Platform.OS === 'web';

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  }
  return SecureStore.getItemAsync(key);
}

async function removeItem(key: string): Promise<void> {
  if (isWeb) {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export const tokenStorage = {
  async setTokens(access: string, refresh: string) {
    await setItem(ACCESS, access);
    await setItem(REFRESH, refresh);
  },
  getAccess: () => getItem(ACCESS),
  getRefresh: () => getItem(REFRESH),
  async clear() {
    await removeItem(ACCESS);
    await removeItem(REFRESH);
  },
};
