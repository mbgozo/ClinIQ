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

// API base URL - would come from environment in real app
const API_BASE = '/api/admin';

// Admin hooks
export function useSystemStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async (): Promise<SystemStats> => {
      const response = await fetch(`${API_BASE}/analytics/stats`);
      if (!response.ok) throw new Error('Failed to fetch system stats');
      const data = await response.json();
      return data.data;
    },
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useSystemAlerts() {
  return useQuery({
    queryKey: ['admin', 'alerts'],
    queryFn: async (): Promise<SystemAlert[]> => {
      const response = await fetch(`${API_BASE}/system/alerts`);
      if (!response.ok) throw new Error('Failed to fetch system alerts');
      const data = await response.json();
      return data.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async (): Promise<AdminUser[]> => {
      const response = await fetch(`${API_BASE}/users`);
      if (!response.ok) throw new Error('Failed to fetch admin users');
      const data = await response.json();
      return data.data;
    },
  });
}

export function useRegularUsers(filters?: { page?: number; limit?: number; search?: string; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'regular-users', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      
      const response = await fetch(`${API_BASE}/regular-users?${params}`);
      if (!response.ok) throw new Error('Failed to fetch regular users');
      return response.json();
    },
  });
}

export function useModerationQueue(filters?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'moderation-queue', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.status) params.append('status', filters.status);
      
      const response = await fetch(`${API_BASE}/moderation/queue?${params}`);
      if (!response.ok) throw new Error('Failed to fetch moderation queue');
      return response.json();
    },
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
      
      const response = await fetch(`${API_BASE}/analytics/users?${params}`);
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
      
      const response = await fetch(`${API_BASE}/analytics/content?${params}`);
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
      
      const response = await fetch(`${API_BASE}/analytics/engagement?${params}`);
      if (!response.ok) throw new Error('Failed to fetch engagement analytics');
      return response.json();
    },
  });
}

export function useSystemSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/system/settings`);
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
      
      const response = await fetch(`${API_BASE}/system/logs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch admin logs');
      return response.json();
    },
  });
}

export function useAdminPermissions() {
  return useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/permissions`);
      if (!response.ok) throw new Error('Failed to fetch admin permissions');
      const data = await response.json();
      return data.data;
    },
  });
}

// Mutations
export function useCreateAdminUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateAdminUserInput) => {
      const response = await fetch(`${API_BASE}/users`, {
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
      const response = await fetch(`${API_BASE}/users/${id}`, {
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
      const response = await fetch(`${API_BASE}/users/${id}`, {
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
      const response = await fetch(`${API_BASE}/regular-users/${userId}/ban`, {
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
      const response = await fetch(`${API_BASE}/regular-users/${userId}/unban`, {
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
      const response = await fetch(`${API_BASE}/regular-users/${userId}`, {
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
      const response = await fetch(`${API_BASE}/moderation/queue/${id}/resolve`, {
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
      const response = await fetch(`${API_BASE}/moderation/queue/${id}/dismiss`, {
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
      const response = await fetch(`${API_BASE}/system/alerts`, {
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
      const response = await fetch(`${API_BASE}/system/alerts/${id}`, {
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
      const response = await fetch(`${API_BASE}/system/alerts/${id}`, {
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
      const response = await fetch(`${API_BASE}/system/settings`, {
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
      const response = await fetch(`${API_BASE}/analytics/export`, {
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
      const response = await fetch(`${API_BASE}/content/questions/${id}`, {
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
      const response = await fetch(`${API_BASE}/content/answers/${id}`, {
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
      const response = await fetch(`${API_BASE}/content/resources/${id}/approve`, {
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
      const response = await fetch(`${API_BASE}/study-groups/${id}`, {
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
      const response = await fetch(`${API_BASE}/chat/messages/${id}`, {
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
