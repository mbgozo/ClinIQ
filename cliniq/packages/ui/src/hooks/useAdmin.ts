import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  SystemStats, 
  SystemAlert, 
  AdminUser, 
  ModerationAction,
  CreateAdminUserInput,
  UpdateAdminUserInput,
  CreateSystemAlertInput
} from '@cliniq/shared-types';
import { BaseHookOptions } from './types';

export interface AdminHookOptions extends BaseHookOptions {}

function getApiBase(options: AdminHookOptions = {}) {
  const apiUrl = options.apiUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  return `${apiUrl}/admin`;
}
// Admin hooks
export function useSystemStats(options: AdminHookOptions = {}) {
  const { enabled = true } = options;
  const apiBase = getApiBase(options);

  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async (): Promise<SystemStats> => {
      const response = await fetch(`${apiBase}/analytics/stats`);
      if (!response.ok) throw new Error('Failed to fetch system stats');
      const data = await response.json();
      return data.data;
    },
    enabled,
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useSystemAlerts(options: AdminHookOptions = {}) {
  const { enabled = true } = options;
  const apiBase = getApiBase(options);

  return useQuery({
    queryKey: ['admin', 'alerts'],
    queryFn: async (): Promise<SystemAlert[]> => {
      const response = await fetch(`${apiBase}/system/alerts`);
      if (!response.ok) throw new Error('Failed to fetch system alerts');
      const data = await response.json();
      return data.data;
    },
    enabled,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useAdminUsers(options: AdminHookOptions = {}) {
  const { enabled = true } = options;
  const apiBase = getApiBase(options);

  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async (): Promise<AdminUser[]> => {
      const response = await fetch(`${apiBase}/users`);
      if (!response.ok) throw new Error('Failed to fetch admin users');
      const data = await response.json();
      return data.data;
    },
    enabled,
  });
}

export function useRegularUsers(filters: { page?: number; limit?: number; search?: string; status?: string } = {}, options: AdminHookOptions = {}) {
  const { enabled = true } = options;
  const apiBase = getApiBase(options);

  return useQuery({
    queryKey: ['admin', 'regular-users', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      
      const response = await fetch(`${apiBase}/regular-users?${params}`);
      if (!response.ok) throw new Error('Failed to fetch regular users');
      return response.json();
    },
    enabled,
  });
}

export function useModerationQueue(filters: { page?: number; limit?: number; status?: string } = {}, options: AdminHookOptions = {}) {
  const { enabled = true } = options;
  const apiBase = getApiBase(options);

  return useQuery({
    queryKey: ['admin', 'moderation-queue', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.status) params.append('status', filters.status);
      
      const response = await fetch(`${apiBase}/moderation/queue?${params}`);
      if (!response.ok) throw new Error('Failed to fetch moderation queue');
      return response.json();
    },
    enabled,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useUserAnalytics(filters?: { period?: string; metric?: string }) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'users', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.period) params.append('period', filters.period);
      if (filters?.metric) params.append('metric', filters.metric);
      
      const response = await fetch(`${getApiBase()}/analytics/users?${params}`);
      if (!response.ok) throw new Error('Failed to fetch user analytics');
      return response.json();
    },
  });
}

export function useContentAnalytics(filters?: { period?: string; type?: string }) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'content', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.period) params.append('period', filters.period);
      if (filters?.type) params.append('type', filters.type);
      
      const response = await fetch(`${getApiBase()}/analytics/content?${params}`);
      if (!response.ok) throw new Error('Failed to fetch content analytics');
      return response.json();
    },
  });
}

export function useEngagementAnalytics(filters?: { period?: string }) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'engagement', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.period) params.append('period', filters.period);
      
      const response = await fetch(`${getApiBase()}/analytics/engagement?${params}`);
      if (!response.ok) throw new Error('Failed to fetch engagement analytics');
      return response.json();
    },
  });
}

export function useSystemSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const response = await fetch(`${getApiBase()}/system/settings`);
      if (!response.ok) throw new Error('Failed to fetch system settings');
      const data = await response.json();
      return data.data;
    },
  });
}

export function useAdminLogs(filters?: { page?: number; limit?: number; adminId?: string; action?: string }) {
  return useQuery({
    queryKey: ['admin', 'logs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.adminId) params.append('adminId', filters.adminId);
      if (filters?.action) params.append('action', filters.action);
      
      const response = await fetch(`${getApiBase()}/system/logs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch admin logs');
      return response.json();
    },
  });
}

export function useAdminPermissions(options: AdminHookOptions = {}) {
  const { enabled = true } = options;
  const apiBase = getApiBase(options);

  return useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: async () => {
      const response = await fetch(`${apiBase}/permissions`);
      if (!response.ok) throw new Error('Failed to fetch admin permissions');
      const data = await response.json();
      return data.data;
    },
    enabled,
  });
}

// Mutations
export function useCreateAdminUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateAdminUserInput) => {
      const response = await fetch(`${getApiBase()}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create admin user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAdminUserInput }) => {
      const response = await fetch(`${getApiBase()}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update admin user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${getApiBase()}/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete admin user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, reason, duration }: { userId: string; reason: string; duration?: number }) => {
      const response = await fetch(`${getApiBase()}/regular-users/${userId}/ban`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, duration }),
      });
      if (!response.ok) throw new Error('Failed to ban user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'regular-users'] });
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`${getApiBase()}/regular-users/${userId}/unban`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to unban user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'regular-users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`${getApiBase()}/regular-users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'regular-users'] });
    },
  });
}

export function useResolveModerationItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, action, reason }: { id: string; action: ModerationAction; reason?: string }) => {
      const response = await fetch(`${getApiBase()}/moderation/queue/${id}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });
      if (!response.ok) throw new Error('Failed to resolve moderation item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderation-queue'] });
    },
  });
}

export function useDismissModerationItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${getApiBase()}/moderation/queue/${id}/dismiss`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to dismiss moderation item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderation-queue'] });
    },
  });
}

export function useCreateSystemAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateSystemAlertInput) => {
      const response = await fetch(`${getApiBase()}/system/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create system alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'alerts'] });
    },
  });
}

export function useUpdateSystemAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateSystemAlertInput> }) => {
      const response = await fetch(`${getApiBase()}/system/alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update system alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'alerts'] });
    },
  });
}

export function useDeleteSystemAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${getApiBase()}/system/alerts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete system alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'alerts'] });
    },
  });
}

export function useUpdateSystemSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const response = await fetch(`${getApiBase()}/system/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update system settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });
}

export function useExportData() {
  return useMutation({
    mutationFn: async ({ type, filters, format }: { type: string; filters?: any; format?: string }) => {
      const response = await fetch(`${getApiBase()}/analytics/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, filters, format }),
      });
      if (!response.ok) throw new Error('Failed to export data');
      return response.json();
    },
  });
}

// Content management mutations
export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${getApiBase()}/content/questions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete question');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'questions'] });
    },
  });
}

export function useDeleteAnswer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${getApiBase()}/content/answers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete answer');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'answers'] });
    },
  });
}

// useDeleteResource removed from useAdmin as it is duplicated in useResources


export function useApproveResource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${getApiBase()}/content/resources/${id}/approve`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to approve resource');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'resources'] });
    },
  });
}

export function useDeleteStudyGroup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${getApiBase()}/study-groups/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete study group');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'study-groups'] });
    },
  });
}

export function useDeleteChatMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${getApiBase()}/chat/messages/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete chat message');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'chat-logs'] });
    },
  });
}
