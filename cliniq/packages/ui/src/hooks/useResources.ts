import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseHookOptions } from './types';

export interface ResourceHookOptions extends BaseHookOptions {}

function getApiUrl(options: ResourceHookOptions = {}) {
  return options.apiUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
}

interface Resource {
  id: string;
  userId: string;
  categoryId?: string;
  title: string;
  description?: string;
  url?: string;
  fileRef?: string;
  fileType?: string;
  course?: string;
  year?: number;
  copyrightAck: boolean;
  downloads: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    institution: string;
  };
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  isFlagged?: boolean;
}

interface ResourceFilter {
  categoryId?: string;
  type?: string;
  course?: string;
  year?: number;
  tags?: string[];
  userId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Flag {
  id: string;
  entityType: string;
  entityId: string;
  reporterId: string;
  reason: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  resolvedBy?: string;
  resolvedAt?: string;
  notes?: string;
  reporter?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export function useResources(filters: ResourceFilter = {}, options: ResourceHookOptions = {}) {
  const { enabled = true } = options;
  const apiUrl = getApiUrl(options);

  return useQuery({
    queryKey: ['resources', filters],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else if (value !== undefined) {
          params.append(key, String(value));
        }
      });
      
      const res = await fetch(`${apiUrl}/resources?${params}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch resources');
      }
      
      const result = await res.json();
      return result.data as { resources: Resource[], total: number };
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useResource(id: string, options: ResourceHookOptions = {}) {
  const { enabled = true } = options;
  const apiUrl = getApiUrl(options);

  return useQuery({
    queryKey: ['resource', id],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      
      const res = await fetch(`${apiUrl}/resources/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch resource');
      }
      
      const result = await res.json();
      return result.data as Resource;
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCategories(options: ResourceHookOptions = {}) {
  const { enabled = true } = options;
  const apiUrl = getApiUrl(options);

  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      
      const res = await fetch(`${apiUrl}/resources/categories`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const result = await res.json();
      return result.data as Category[];
    },
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/resources`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });
      
      if (!res.ok) {
        throw new Error('Failed to create resource');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    }
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/resources/${id}`, {
        method: 'PUT',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });
      
      if (!res.ok) {
        throw new Error('Failed to update resource');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    }
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/resources/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete resource');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    }
  });
}

export function useDownloadResource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/resources/${id}/download`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to download resource');
      }
      
      const result = await res.json();
      return result.data as { downloadUrl: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    }
  });
}

export function useFlagResource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/resources/${id}/flag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ reason })
      });
      
      if (!res.ok) {
        throw new Error('Failed to flag resource');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    }
  });
}

// Admin hooks for flag management
export function usePendingFlags(options: ResourceHookOptions = {}) {
  const { enabled = true } = options;
  const apiUrl = getApiUrl(options);

  return useQuery({
    queryKey: ['pending-flags'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      
      const res = await fetch(`${apiUrl}/resources/flags/pending`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch pending flags');
      }
      
      const result = await res.json();
      return result.data as Flag[];
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useResolveFlag() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/resources/flags/${id}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ notes })
      });
      
      if (!res.ok) {
        throw new Error('Failed to resolve flag');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-flags'] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    }
  });
}

export function useDismissFlag() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/resources/flags/${id}/dismiss`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ notes })
      });
      
      if (!res.ok) {
        throw new Error('Failed to dismiss flag');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-flags'] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    }
  });
}
