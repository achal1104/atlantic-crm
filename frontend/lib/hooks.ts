import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

// --- Types ---
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  status: string;
  business?: string;
  city?: string;
  state?: string;
  budget?: number;
  leadScore: number;
  remarks?: string;
  nextFollowUp?: string;
  assignedToId?: string;
  assignedTo?: { id: string; name: string; email: string };
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface LeadFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  sortBy?: string;
  order?: string;
}

// --- Dashboard ---
export const useDashboardStats = () =>
  useQuery({ queryKey: ['dashboard'], queryFn: () => api.get('/dashboard/stats').then(r => r.data.data) });

// --- Analytics ---
export const useAnalytics = () =>
  useQuery({ queryKey: ['analytics'], queryFn: () => api.get('/analytics').then(r => r.data.data) });

// --- Leads ---
export const useLeads = (filters: LeadFilters = {}) =>
  useQuery({
    queryKey: ['leads', filters],
    queryFn: () => api.get('/leads', { params: filters }).then(r => r.data),
  });

export const useLead = (id: string) =>
  useQuery({ queryKey: ['lead', id], queryFn: () => api.get(`/leads/${id}`).then(r => r.data.data), enabled: !!id });

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Lead>) => api.post('/leads', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
};

export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) => api.put(`/leads/${id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
};

export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/leads/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
};

// --- Follow-ups ---
export const useFollowUps = (leadId?: string) =>
  useQuery({ queryKey: ['followups', leadId], queryFn: () => api.get('/followups', { params: { leadId } }).then(r => r.data.data) });

export const useCreateFollowUp = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/followups', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['followups'] }),
  });
};

export const useCompleteFollowUp = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put(`/followups/${id}/complete`, {}).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['followups'] }),
  });
};

// --- Users ---
export const useUsers = () =>
  useQuery({ queryKey: ['users'], queryFn: () => api.get('/users').then(r => r.data.data) });

export const useProfile = () =>
  useQuery({ queryKey: ['profile'], queryFn: () => api.get('/users/profile').then(r => r.data.data) });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; avatar?: string }) => api.put('/users/profile', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      api.put('/users/change-password', data).then(r => r.data),
  });

// --- Notifications ---
export const useNotifications = () =>
  useQuery({ queryKey: ['notifications'], queryFn: () => api.get('/notifications').then(r => r.data.data), refetchInterval: 30000 });

export const useMarkAllRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.put('/notifications/read-all', {}).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

export const useMarkOneRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put(`/notifications/${id}/read`, {}).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};
