// ============================================================================
// Design tokens + app constants. Colours mirror tailwind.config.js so charts
// and inline styles (SVG) stay in sync with NativeWind utility classes.
// ============================================================================
import { ApplicationStage } from '@jobhunter/types';

// Re-export so screens/components can pull pipeline column order from one place.
export { PIPELINE_COLUMNS } from '@jobhunter/types';

export const COLORS = {
  navy900: '#0A1F44',
  navy700: '#14276B',
  navy500: '#1E3A8A',
  brand: '#2563EB',
  brand600: '#1D4ED8',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  info: '#0891B2',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray700: '#374151',
  gray900: '#111827',
  white: '#FFFFFF',
} as const;

export const APP = {
  name: 'JobHunter',
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api/v1',
  socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3009',
  // Mocks on by default so the app runs with zero backend (see lib/mocks).
  useMocks: (process.env.EXPO_PUBLIC_USE_MOCKS ?? 'true') !== 'false',
  version: '2.0.0',
} as const;

/** Stage → display colour for badges / kanban headers. */
export const STAGE_COLOR: Record<ApplicationStage, string> = {
  [ApplicationStage.SOURCED]: COLORS.gray500,
  [ApplicationStage.SUBMITTED]: COLORS.info,
  [ApplicationStage.VIEWED]: COLORS.info,
  [ApplicationStage.SHORTLISTED]: COLORS.brand,
  [ApplicationStage.SCREENING]: COLORS.warning,
  [ApplicationStage.INTERVIEW]: COLORS.navy500,
  [ApplicationStage.FEEDBACK]: COLORS.warning,
  [ApplicationStage.OFFER]: COLORS.success,
  [ApplicationStage.HIRED]: COLORS.success,
  [ApplicationStage.REJECTED]: COLORS.danger,
  [ApplicationStage.WITHDRAWN]: COLORS.gray400,
  [ApplicationStage.NO_SHOW]: COLORS.danger,
};

export const STAGE_LABEL: Record<ApplicationStage, string> = {
  [ApplicationStage.SOURCED]: 'Sourced',
  [ApplicationStage.SUBMITTED]: 'Applied',
  [ApplicationStage.VIEWED]: 'Viewed',
  [ApplicationStage.SHORTLISTED]: 'Shortlisted',
  [ApplicationStage.SCREENING]: 'Screening',
  [ApplicationStage.INTERVIEW]: 'Interview',
  [ApplicationStage.FEEDBACK]: 'Feedback',
  [ApplicationStage.OFFER]: 'Offer',
  [ApplicationStage.HIRED]: 'Hired',
  [ApplicationStage.REJECTED]: 'Rejected',
  [ApplicationStage.WITHDRAWN]: 'Withdrawn',
  [ApplicationStage.NO_SHOW]: 'No-show',
};
