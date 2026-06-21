// Root RTK Query API. Domain endpoints are injected in sibling files.
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'Candidate',
    'CV',
    'ResumeAI',
    'Job',
    'Application',
    'Notification',
    'Interview',
    'JD',
    'Pipeline',
    'VoiceCampaign',
    'EmailCampaign',
    'Offer',
    'Analytics',
    'AdminUser',
    'Org',
    'Audit',
    'AiMonitor',
  ],
  endpoints: () => ({}),
});
