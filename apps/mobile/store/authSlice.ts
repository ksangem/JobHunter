import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Role, User } from '@jobhunter/types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  bootstrapped: boolean; // token-restore attempt finished
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  bootstrapped: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    setBootstrapped(state, action: PayloadAction<boolean>) {
      state.bootstrapped = action.payload;
    },
  },
});

export const { setUser, clearUser, setBootstrapped } = authSlice.actions;
export default authSlice.reducer;

/** Home route for a role after login (Expo Router groups). */
export function homeRouteForRole(role: Role): string {
  switch (role) {
    case 'CANDIDATE':
      return '/(candidate)/dashboard';
    case 'SUPER_ADMIN':
    case 'ORG_ADMIN':
      return '/(admin)/organisations';
    default:
      return '/(recruiter)/dashboard';
  }
}
