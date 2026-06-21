// Recruiter-domain endpoints: JD, pipeline, voice, email, interviews, offers,
// analytics. (Kept together; the prompt's jdApi/pipelineApi/voiceApi/emailApi/
// interviewApi/analyticsApi are exported as named hook groups below.)
import type {
  Application,
  CallLog,
  EmailCampaign,
  Interview,
  JobDescription,
  MarketRole,
  Offer,
  PriorityMatrix,
  RecruiterDashboard,
  VoiceCampaign,
} from '@jobhunter/types';
import { baseApi } from './baseApi';

type PipelineCard = Application & { candidate: Record<string, unknown>; consented: boolean };

export const recruiterApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // ---- JD ----
    listJds: b.query<JobDescription[], void>({
      query: () => ({ url: '/jds' }),
      providesTags: ['JD'],
    }),
    getJd: b.query<JobDescription, string>({
      query: (id) => ({ url: `/jds/${id}` }),
      providesTags: ['JD'],
    }),
    createJd: b.mutation<JobDescription, Partial<JobDescription>>({
      query: (body) => ({ url: '/jds', method: 'POST', body }),
      invalidatesTags: ['JD'],
    }),
    updateJd: b.mutation<JobDescription, { id: string; patch: Partial<JobDescription> }>({
      query: ({ id, patch }) => ({ url: `/jds/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: ['JD'],
    }),
    uploadJd: b.mutation<{ job_id: string; extraction_confidence: number; extracted: Record<string, unknown> }, { filename: string }>({
      query: (body) => ({ url: '/jds/upload', method: 'POST', body }),
    }),
    setPriorityMatrix: b.mutation<JobDescription, { id: string; matrix: PriorityMatrix }>({
      query: ({ id, matrix }) => ({ url: `/jds/${id}/priority-matrix`, method: 'POST', body: matrix }),
      invalidatesTags: ['JD'],
    }),
    transitionJd: b.mutation<JobDescription, { id: string; action: 'submit-review' | 'approve' | 'publish' | 'close' | 'archive' }>({
      query: ({ id, action }) => ({ url: `/jds/${id}/${action}`, method: 'POST' }),
      invalidatesTags: ['JD'],
    }),
    // ---- Pipeline ----
    getPipeline: b.query<PipelineCard[], string | void>({
      query: (jdId) => ({ url: '/pipeline', params: { jd_id: jdId || undefined } }),
      providesTags: ['Pipeline'],
    }),
    changeStage: b.mutation<PipelineCard, { candidateId: string; stage: string }>({
      query: ({ candidateId, stage }) => ({ url: `/pipeline/${candidateId}/stage`, method: 'PATCH', body: { stage } }),
      invalidatesTags: ['Pipeline'],
    }),
    approveCandidate: b.mutation<{ id: string }, string>({
      query: (candidateId) => ({ url: `/pipeline/${candidateId}/approve`, method: 'POST' }),
      invalidatesTags: ['Pipeline'],
    }),
    generateShortlist: b.mutation<{ job_id: string; message: string }, string>({
      query: (jdId) => ({ url: '/pipeline/generate-shortlist', method: 'POST', body: { jd_id: jdId } }),
      invalidatesTags: ['Pipeline'],
    }),
    similarCandidates: b.query<PipelineCard[], string>({
      query: (candidateId) => ({ url: `/pipeline/${candidateId}/similar` }),
    }),
    // ---- Voice ----
    listVoiceCampaigns: b.query<VoiceCampaign[], void>({
      query: () => ({ url: '/voice/campaigns' }),
      providesTags: ['VoiceCampaign'],
    }),
    createVoiceCampaign: b.mutation<VoiceCampaign, Partial<VoiceCampaign>>({
      query: (body) => ({ url: '/voice/campaigns', method: 'POST', body }),
      invalidatesTags: ['VoiceCampaign'],
    }),
    getCallLogs: b.query<CallLog[], string>({
      query: (campaignId) => ({ url: `/voice/campaigns/${campaignId}/calls` }),
    }),
    voiceCampaignAction: b.mutation<VoiceCampaign, { id: string; action: 'launch' | 'pause' | 'resume' }>({
      query: ({ id, action }) => ({ url: `/voice/campaigns/${id}/${action}`, method: 'POST' }),
      invalidatesTags: ['VoiceCampaign'],
    }),
    // ---- Email ----
    listEmailCampaigns: b.query<EmailCampaign[], void>({
      query: () => ({ url: '/email/campaigns' }),
      providesTags: ['EmailCampaign'],
    }),
    createEmailCampaign: b.mutation<EmailCampaign, Partial<EmailCampaign>>({
      query: (body) => ({ url: '/email/campaigns', method: 'POST', body }),
      invalidatesTags: ['EmailCampaign'],
    }),
    emailCampaignAction: b.mutation<EmailCampaign, { id: string; action: 'launch' | 'pause' | 'send-test' }>({
      query: ({ id, action }) => ({ url: `/email/campaigns/${id}/${action}`, method: 'POST' }),
      invalidatesTags: ['EmailCampaign'],
    }),
    // ---- Interviews ----
    listInterviews: b.query<Interview[], void>({
      query: () => ({ url: '/interviews' }),
      providesTags: ['Interview'],
    }),
    confirmInterview: b.mutation<Interview, string>({
      query: (id) => ({ url: `/interviews/${id}/confirm`, method: 'POST' }),
      invalidatesTags: ['Interview'],
    }),
    scheduleInterview: b.mutation<Interview, Record<string, unknown>>({
      query: (body) => ({ url: '/recruiter/interviews', method: 'POST', body }),
      invalidatesTags: ['Interview', 'Pipeline'],
    }),
    // ---- Offers ----
    listOffers: b.query<Offer[], void>({
      query: () => ({ url: '/offers' }),
      providesTags: ['Offer'],
    }),
    offerAction: b.mutation<Offer, { id: string; action: 'approve' | 'accept' | 'decline' | 'revoke' }>({
      query: ({ id, action }) => ({ url: `/offers/${id}/${action}`, method: 'POST' }),
      invalidatesTags: ['Offer'],
    }),
    // ---- Analytics ----
    getRecruiterDashboard: b.query<RecruiterDashboard, void>({
      query: () => ({ url: '/analytics/recruiter/dashboard' }),
      providesTags: ['Analytics'],
    }),
    // ---- Org + settings (onboarding / settings screens) ----
    getMyOrg: b.query<import('@jobhunter/types').Organisation, void>({
      query: () => ({ url: '/recruiter/org' }),
      providesTags: ['Org'],
    }),
    upsertOrg: b.mutation<import('@jobhunter/types').Organisation, Record<string, unknown>>({
      query: (body) => ({ url: '/recruiter/org', method: 'POST', body }),
      invalidatesTags: ['Org'],
    }),
    saveRecruiterSettings: b.mutation<{ ok: boolean }, Record<string, unknown>>({
      query: (body) => ({ url: '/recruiter/settings', method: 'POST', body }),
    }),
    getMarketIntel: b.query<{ roles: MarketRole[] }, void>({
      query: () => ({ url: '/analytics/market' }),
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useListJdsQuery,
  useGetJdQuery,
  useCreateJdMutation,
  useUpdateJdMutation,
  useUploadJdMutation,
  useSetPriorityMatrixMutation,
  useTransitionJdMutation,
  useGetPipelineQuery,
  useChangeStageMutation,
  useApproveCandidateMutation,
  useGenerateShortlistMutation,
  useSimilarCandidatesQuery,
  useListVoiceCampaignsQuery,
  useCreateVoiceCampaignMutation,
  useGetCallLogsQuery,
  useVoiceCampaignActionMutation,
  useListEmailCampaignsQuery,
  useCreateEmailCampaignMutation,
  useEmailCampaignActionMutation,
  useListInterviewsQuery,
  useConfirmInterviewMutation,
  useScheduleInterviewMutation,
  useListOffersQuery,
  useOfferActionMutation,
  useGetRecruiterDashboardQuery,
  useGetMarketIntelQuery,
  useGetMyOrgQuery,
  useUpsertOrgMutation,
  useSaveRecruiterSettingsMutation,
} = recruiterApi;
