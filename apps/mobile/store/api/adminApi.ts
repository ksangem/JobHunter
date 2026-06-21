import type { AiMonitorRow, AuditLog, Organisation, User } from '@jobhunter/types';
import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listUsers: b.query<User[], void>({
      query: () => ({ url: '/admin/users' }),
      providesTags: ['AdminUser'],
    }),
    updateUser: b.mutation<User, { id: string; patch: Partial<User> }>({
      query: ({ id, patch }) => ({ url: `/admin/users/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: ['AdminUser'],
    }),
    listOrgs: b.query<Organisation[], void>({
      query: () => ({ url: '/admin/orgs' }),
      providesTags: ['Org'],
    }),
    updateOrg: b.mutation<Organisation, { id: string; patch: Partial<Organisation> }>({
      query: ({ id, patch }) => ({ url: `/admin/orgs/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: ['Org'],
    }),
    listAudit: b.query<AuditLog[], void>({
      query: () => ({ url: '/admin/audit' }),
      providesTags: ['Audit'],
    }),
    getAiMonitoring: b.query<AiMonitorRow[], void>({
      query: () => ({ url: '/admin/ai-monitoring' }),
      providesTags: ['AiMonitor'],
    }),
    requestErasure: b.mutation<{ workflow_id: string; sla_days: number }, { candidate_id: string }>({
      query: (body) => ({ url: '/admin/gdpr/erasure', method: 'POST', body }),
    }),
  }),
});

export const {
  useListUsersQuery,
  useUpdateUserMutation,
  useListOrgsQuery,
  useUpdateOrgMutation,
  useListAuditQuery,
  useGetAiMonitoringQuery,
  useRequestErasureMutation,
} = adminApi;
