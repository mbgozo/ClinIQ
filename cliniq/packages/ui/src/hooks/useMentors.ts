import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Mentor {
  id: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    institution: string;
    program: string;
  };
  bio: string;
  expertiseAreas: string[];
  institution: string;
  currentRole: string;
  availability: string;
  languages: string[];
  verifiedAt?: string;
  mentorRating: number;
  mentorshipCount: number;
  acceptanceRate: number;
  createdAt: string;
  updatedAt: string;
}

interface MentorProfile {
  id: string;
  userId: string;
  bio: string;
  experience: string;
  expertiseAreas: string[];
  institution: string;
  graduationYear: number;
  currentRole: string;
  linkedinUrl?: string;
  availability: string;
  languages: string[];
  verificationStatus: string;
  verifiedAt?: string;
  rejectionReason?: string;
  totalAnswers: number;
  acceptedAnswers: number;
  acceptanceRate: number;
  averageResponseTime: number;
  mentorRating: number;
  mentorshipCount: number;
  createdAt: string;
  updatedAt: string;
}

interface MentorshipRequest {
  id: string;
  mentorId: string;
  studentId: string;
  topic: string;
  description: string;
  urgency: string;
  preferredTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  completedAt?: string;
  rejectionReason?: string;
  notes?: string;
  studentRating?: number;
  mentorRating?: number;
  mentor?: {
    user: {
      id: string;
      name: string;
      avatarUrl?: string;
    };
  };
  student?: {
    id: string;
    name: string;
    avatarUrl?: string;
    institution: string;
    program: string;
  };
}

interface MentorFilter {
  expertiseAreas?: string[];
  institution?: string;
  verificationStatus?: string;
  minRating?: number;
  availability?: string;
  languages?: string[];
  page?: number;
  limit?: number;
}

export function useMentors(filters: MentorFilter = {}) {
  return useQuery({
    queryKey: ['mentors', filters],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else if (value !== undefined) {
          params.append(key, String(value));
        }
      });
      
      const res = await fetch(`${API_URL}/mentors?${params}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch mentors');
      }
      
      const result = await res.json();
      return result.data as { mentors: Mentor[], total: number };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMentorProfile(userId?: string) {
  return useQuery({
    queryKey: ['mentor-profile', userId],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/mentors/profile`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch mentor profile');
      }
      
      const result = await res.json();
      return result.data as MentorProfile;
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useMentorById(mentorId: string) {
  return useQuery({
    queryKey: ['mentor', mentorId],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/mentors/${mentorId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch mentor');
      }
      
      const result = await res.json();
      return result.data as Mentor;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateMentorProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      bio: string;
      experience: string;
      expertiseAreas: string[];
      institution: string;
      graduationYear: number;
      currentRole: string;
      linkedinUrl?: string;
      availability: string;
      languages: string[];
    }) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/mentors/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        throw new Error('Failed to create mentor profile');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-profile'] });
    }
  });
}

export function useMentorshipRequests(type: 'sent' | 'received', filters: any = {}) {
  return useQuery({
    queryKey: ['mentorship-requests', type, filters],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const endpoint = type === 'sent' ? 'requests/sent' : 'requests/received';
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
      
      const res = await fetch(`${API_URL}/mentors/${endpoint}?${params}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch mentorship requests');
      }
      
      const result = await res.json();
      return result.data as { requests: MentorshipRequest[], total: number };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateMentorshipRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      mentorId: string;
      topic: string;
      description: string;
      urgency: string;
      preferredTime: string;
    }) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/mentors/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        throw new Error('Failed to create mentorship request');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship-requests'] });
    }
  });
}

export function useUpdateMentorshipRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      requestId, 
      action, 
      reason 
    }: { 
      requestId: string; 
      action: 'accept' | 'reject' | 'complete'; 
      reason?: string 
    }) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/mentors/requests/${requestId}/${action}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: reason ? JSON.stringify({ reason }) : undefined
      });
      
      if (!res.ok) {
        throw new Error(`Failed to ${action} mentorship request`);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship-requests'] });
    }
  });
}
