import { useQuery } from '@tanstack/react-query';
import { BaseHookOptions } from './types';

export function useUnreadCount(options: BaseHookOptions = {}) {
  const { 
    apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    enabled = true
  } = options;

  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      
      const res = await fetch(`${apiUrl}/notifications/unread-count`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch unread count');
      }
      
      const result = await res.json();
      return result.data.count;
    },
    enabled,
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });

  return {
    count: data || 0,
    isLoading,
    error
  };
}
