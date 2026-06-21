// ============================================================================
// Mock-aware RTK Query baseQuery. When EXPO_PUBLIC_USE_MOCKS is on (default),
// requests resolve against the in-memory mock router. Otherwise they hit the
// real API gateway via fetch, attaching the JWT and unwrapping the
// { data, meta, error } envelope. Endpoints are written ONCE and work in both
// modes — flip the env var to go live.
// ============================================================================
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { ApiError } from '@jobhunter/types';
import { APP } from '@/lib/constants';
import { tokenStorage } from '@/lib/token-storage';
import { MockHttpError, mockRequest } from '@/lib/mocks/router';
import { sleep } from '@/lib/utils';

export interface QueryArgs {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | undefined>;
}

export interface QueryError {
  status: number;
  data: ApiError;
}

function withParams(url: string, params?: QueryArgs['params']): string {
  if (!params) return url;
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return qs ? `${url}?${qs}` : url;
}

export const baseQuery: BaseQueryFn<QueryArgs, unknown, QueryError> = async (args) => {
  const method = args.method ?? 'GET';
  const url = withParams(args.url, args.params);

  // ---- Mock mode -------------------------------------------------------
  if (APP.useMocks) {
    await sleep(180); // simulate network latency for realistic loading states
    try {
      const data = await mockRequest({ url, method, body: args.body });
      return { data };
    } catch (e) {
      if (e instanceof MockHttpError) return { error: { status: e.status, data: e.problem } };
      const err: ApiError = { type: 'about:blank', title: 'Mock error', status: 500, detail: String(e) };
      return { error: { status: 500, data: err } };
    }
  }

  // ---- Live mode -------------------------------------------------------
  try {
    const token = await tokenStorage.getAccess();
    const res = await fetch(`${APP.apiBaseUrl}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(method !== 'GET' ? { 'Idempotency-Key': cryptoRandom() } : {}),
      },
      body: args.body ? JSON.stringify(args.body) : undefined,
    });
    const json = await res.json();
    if (!res.ok || json.error) {
      return { error: { status: res.status, data: json.error as ApiError } };
    }
    return { data: json.data };
  } catch (e) {
    return { error: { status: 0, data: { type: 'about:blank', title: 'Network error', status: 0, detail: String(e) } } };
  }
};

function cryptoRandom(): string {
  // Idempotency-Key on all writes (Master Prompt API design).
  return `${Date.now()}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}
