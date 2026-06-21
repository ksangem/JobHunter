// ============================================================================
// useAuth — session lifecycle on top of the auth slice + secure token storage.
// Restores a session on boot, exposes login/logout, and computes the role home.
// ============================================================================
import { useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import type { AuthTokens, User } from '@jobhunter/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearUser, homeRouteForRole, setBootstrapped, setUser } from '@/store/authSlice';
import { useLogoutMutation } from '@/store/api/authApi';
import { tokenStorage } from '@/lib/token-storage';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, bootstrapped } = useAppSelector((s) => s.auth);
  const [logoutMutation] = useLogoutMutation();

  // Attempt silent restore once on mount. (Mock mode has no persisted user, so
  // this resolves to "not authenticated" and routes to login.)
  useEffect(() => {
    if (bootstrapped) return;
    (async () => {
      const token = await tokenStorage.getAccess();
      // In a live build we'd call /auth/me here; mock mode keeps it simple.
      if (!token) dispatch(setBootstrapped(true));
      else dispatch(setBootstrapped(true));
    })();
  }, [bootstrapped, dispatch]);

  const completeLogin = useCallback(
    async (tokens: AuthTokens, loggedInUser: User, nextRoute?: string) => {
      await tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);
      dispatch(setUser(loggedInUser));
      router.replace((nextRoute ?? homeRouteForRole(loggedInUser.role)) as never);
    },
    [dispatch],
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      /* ignore network errors on logout */
    }
    await tokenStorage.clear();
    dispatch(clearUser());
    router.replace('/(auth)/login' as never);
  }, [dispatch, logoutMutation]);

  return { user, isAuthenticated, bootstrapped, completeLogin, logout };
}
