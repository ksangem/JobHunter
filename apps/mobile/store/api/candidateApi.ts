import type {
  AtsScore,
  AtsSuggestion,
  Application,
  Candidate,
  CandidateDashboard,
  CompletenessResult,
  CvVersion,
  JobPreferences,
  JobRecommendation,
  Notification,
  SkillGap,
} from '@jobhunter/types';
import { baseApi } from './baseApi';

export const candidateApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getMe: b.query<Candidate, void>({
      query: () => ({ url: '/candidates/me' }),
      providesTags: ['Candidate'],
    }),
    updateMe: b.mutation<Candidate, Partial<Candidate>>({
      query: (body) => ({ url: '/candidates/me', method: 'PATCH', body }),
      invalidatesTags: ['Candidate'],
    }),
    getCompleteness: b.query<CompletenessResult, void>({
      query: () => ({ url: '/candidates/me/completeness' }),
      providesTags: ['Candidate'],
    }),
    getDashboard: b.query<CandidateDashboard, void>({
      query: () => ({ url: '/candidates/me/dashboard' }),
      providesTags: ['Candidate', 'Application'],
    }),
    getPreferences: b.query<JobPreferences, void>({
      query: () => ({ url: '/candidates/me/preferences' }),
      providesTags: ['Candidate'],
    }),
    updatePreferences: b.mutation<JobPreferences, JobPreferences>({
      query: (body) => ({ url: '/candidates/me/preferences', method: 'PUT', body }),
      invalidatesTags: ['Candidate', 'Job'],
    }),
    completeOnboarding: b.mutation<{ ok: boolean }, Partial<Candidate>>({
      query: (body) => ({ url: '/candidates/me/onboarding', method: 'POST', body }),
      invalidatesTags: ['Candidate'],
    }),
    saveSettings: b.mutation<{ ok: boolean }, Record<string, unknown>>({
      query: (body) => ({ url: '/candidates/me/settings', method: 'POST', body }),
    }),
    // ---- CV versions ----
    listCvs: b.query<CvVersion[], void>({
      query: () => ({ url: '/candidates/me/cv' }),
      providesTags: ['CV'],
    }),
    uploadCv: b.mutation<CvVersion, { filename: string; size_bytes: number }>({
      query: (body) => ({ url: '/candidates/me/cv', method: 'POST', body }),
      invalidatesTags: ['CV'],
    }),
    activateCv: b.mutation<CvVersion, string>({
      query: (id) => ({ url: `/candidates/me/cv/${id}/activate`, method: 'PATCH' }),
      invalidatesTags: ['CV', 'ResumeAI'],
    }),
    deleteCv: b.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `/candidates/me/cv/${id}`, method: 'DELETE' }),
      invalidatesTags: ['CV'],
    }),
    // ---- Resume AI ----
    getAtsScore: b.query<AtsScore, void>({
      query: () => ({ url: '/resume-ai/score' }),
      providesTags: ['ResumeAI'],
    }),
    getSuggestions: b.query<AtsSuggestion[], void>({
      query: () => ({ url: '/resume-ai/suggestions' }),
      providesTags: ['ResumeAI'],
    }),
    recalculateAts: b.mutation<{ job_id: string }, void>({
      query: () => ({ url: '/resume-ai/recalculate', method: 'POST' }),
      invalidatesTags: ['ResumeAI'],
    }),
    getSkillGap: b.query<SkillGap, string>({
      query: (jdId) => ({ url: `/resume-ai/skill-gap/${jdId}`, method: 'POST' }),
    }),
    rebuildResume: b.mutation<{ job_id: string; note: string }, string>({
      query: (jdId) => ({ url: `/resume-ai/rebuild/${jdId}`, method: 'POST' }),
      invalidatesTags: ['CV'],
    }),
    // ---- Jobs / applications / notifications ----
    getRecommendations: b.query<JobRecommendation[], void>({
      query: () => ({ url: '/jobs/recommendations' }),
      providesTags: ['Job'],
    }),
    searchJobs: b.query<{ items: import('@jobhunter/types').JobDescription[] }, string | void>({
      query: (q) => ({ url: '/jobs/search', params: { q: q || undefined } }),
      providesTags: ['Job'],
    }),
    applyToJob: b.mutation<Application, string>({
      query: (jobId) => ({ url: `/jobs/${jobId}/apply`, method: 'POST' }),
      invalidatesTags: ['Application', 'Job'],
    }),
    listApplications: b.query<Application[], void>({
      query: () => ({ url: '/applications' }),
      providesTags: ['Application'],
    }),
    withdrawApplication: b.mutation<Application, string>({
      query: (id) => ({ url: `/applications/${id}/withdraw`, method: 'POST' }),
      invalidatesTags: ['Application'],
    }),
    listNotifications: b.query<Notification[], void>({
      query: () => ({ url: '/notifications' }),
      providesTags: ['Notification'],
    }),
    markNotificationRead: b.mutation<Notification, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PATCH' }),
      invalidatesTags: ['Notification'],
    }),
    markAllRead: b.mutation<{ ok: boolean }, void>({
      query: () => ({ url: '/notifications/read-all', method: 'PATCH' }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useGetCompletenessQuery,
  useGetDashboardQuery,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
  useCompleteOnboardingMutation,
  useSaveSettingsMutation,
  useListCvsQuery,
  useUploadCvMutation,
  useActivateCvMutation,
  useDeleteCvMutation,
  useGetAtsScoreQuery,
  useGetSuggestionsQuery,
  useRecalculateAtsMutation,
  useGetSkillGapQuery,
  useRebuildResumeMutation,
  useGetRecommendationsQuery,
  useSearchJobsQuery,
  useApplyToJobMutation,
  useListApplicationsQuery,
  useWithdrawApplicationMutation,
  useListNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllReadMutation,
} = candidateApi;
