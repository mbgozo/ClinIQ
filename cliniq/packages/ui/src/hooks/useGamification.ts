import { useQuery } from '@tanstack/react-query';

interface UserReputation {
  userId: string;
  totalReputation: number;
  answerReputation: number;
  questionReputation: number;
  badgeCount: number;
  level: string;
  levelNumber: number;
  nextLevelReputation: number;
}

interface UserBadge {
  id: string;
  userId: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  awardedAt: string;
  category: string;
  tier: string;
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatarUrl?: string;
  institution: string;
  program: string;
  totalReputation: number;
  answerReputation: number;
  questionReputation: number;
  badgeCount: number;
  level: string;
  levelNumber: number;
  nextLevelReputation: number;
}

export function useGamificationProfile(userId?: string) {
  return useQuery({
    queryKey: ['gamification-profile', userId],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/gamification/profile`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch gamification profile');
      }
      
      const result = await res.json();
      return result.data as UserReputation;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUserBadges(userId?: string) {
  return useQuery({
    queryKey: ['user-badges', userId],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/gamification/badges`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch user badges');
      }
      
      const result = await res.json();
      return result.data as UserBadge[];
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/gamification/leaderboard`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      const result = await res.json();
      return result.data as LeaderboardUser[];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useBadgeDefinitions() {
  return useQuery({
    queryKey: ['badge-definitions'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/gamification/badge-definitions`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch badge definitions');
      }
      
      const result = await res.json();
      return result.data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
