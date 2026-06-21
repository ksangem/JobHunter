import type { AuthTokens, LoginResult, RegisterDto, User } from '@jobhunter/types';
import { baseApi } from './baseApi';

type LoginWithUser = LoginResult & { user?: User };

export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    login: b.mutation<LoginWithUser, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    verifyMfa: b.mutation<{ tokens: AuthTokens; user: User }, { temp_token: string; totp_code: string }>({
      query: (body) => ({ url: '/auth/mfa/verify', method: 'POST', body }),
    }),
    register: b.mutation<{ ok: boolean; email: string }, RegisterDto>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    verifyEmail: b.mutation<{ tokens: AuthTokens; user: User }, { email: string; otp: string }>({
      query: (body) => ({ url: '/auth/verify-email', method: 'POST', body }),
    }),
    mfaSetup: b.mutation<{ provisioning_uri: string; recovery_codes: string[] }, void>({
      query: () => ({ url: '/auth/mfa/setup', method: 'POST' }),
    }),
    logout: b.mutation<{ ok: boolean }, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyMfaMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useMfaSetupMutation,
  useLogoutMutation,
} = authApi;
