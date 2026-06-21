// ============================================================================
// API envelope (Master Prompt: every response matches { data, meta, error })
// Errors follow RFC 7807 (Tech Specs §15.1).
// ============================================================================

export interface ApiMeta {
  timestamp: string;
  request_id: string;
  version: string;
}

export interface ApiError {
  /** RFC 7807 problem detail */
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
  error: null;
}

export interface ApiErrorResponse {
  data: null;
  meta: ApiMeta;
  error: ApiError;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

// ---- Auth payloads -------------------------------------------------------

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginResult {
  mfa_required: boolean;
  temp_token?: string;
  tokens?: AuthTokens;
}

export interface RegisterDto {
  email: string;
  password: string;
  full_name: string;
  role?: 'CANDIDATE';
}
