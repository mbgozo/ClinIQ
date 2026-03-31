import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface StudyGroup {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  categoryId?: string;
  institution?: string;
  privacy: string;
  cadence: string;
  maxMembers: number;
  memberCount: number;
  postCount: number;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
  owner: {
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
  userRole?: string;
  joinedAt?: string;
}

interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    institution: string;
    program: string;
  };
}

interface GroupPost {
  id: string;
  groupId: string;
  userId: string;
  body: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    institution: string;
  };
  isFlagged?: boolean;
}

interface GroupInvite {
  id: string;
  groupId: string;
  inviterId: string;
  inviteeId?: string;
  inviteeEmail: string;
  status: string;
  message?: string;
  createdAt: string;
  expiresAt: string;
  respondedAt?: string;
  inviter?: {
    id: string;
    name: string;
    avatarUrl?: string;
    institution: string;
  };
  group?: {
    id: string;
    name: string;
    description: string;
    privacy: string;
    memberCount: number;
  };
}

interface GroupFilter {
  categoryId?: string;
  institution?: string;
  privacy?: string;
  cadence?: string;
  search?: string;
  hasSpace?: boolean;
  page?: number;
  limit?: number;
}

export function useStudyGroups(filters: GroupFilter = {}) {
  return useQuery({
    queryKey: ['study-groups', filters],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
      
      const res = await fetch(`${API_URL}/study-groups?${params}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch study groups');
      }
      
      const result = await res.json();
      return result.data as { groups: StudyGroup[], total: number };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMyStudyGroups() {
  return useQuery({
    queryKey: ['my-study-groups'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups/my-groups`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch my study groups');
      }
      
      const result = await res.json();
      return result.data as StudyGroup[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useStudyGroup(id: string) {
  return useQuery({
    queryKey: ['study-group', id],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch study group');
      }
      
      const result = await res.json();
      return result.data as StudyGroup;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateStudyGroup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      categoryId?: string;
      institution?: string;
      privacy: string;
      cadence: string;
      maxMembers: number;
    }) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        throw new Error('Failed to create study group');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-groups'] });
      queryClient.invalidateQueries({ queryKey: ['my-study-groups'] });
    }
  });
}

export function useJoinStudyGroup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ groupId, inviteCode }: { groupId: string; inviteCode?: string }) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ inviteCode })
      });
      
      if (!res.ok) {
        throw new Error('Failed to join study group');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-groups'] });
      queryClient.invalidateQueries({ queryKey: ['my-study-groups'] });
    }
  });
}

export function useLeaveStudyGroup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (groupId: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups/${groupId}/leave`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to leave study group');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-groups'] });
      queryClient.invalidateQueries({ queryKey: ['my-study-groups'] });
    }
  });
}

export function useGroupMembers(groupId: string) {
  return useQuery({
    queryKey: ['group-members', groupId],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups/${groupId}/members`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch group members');
      }
      
      const result = await res.json();
      return result.data as GroupMember[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useGroupPosts(groupId: string, query: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ['group-posts', groupId, query],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
      
      const res = await fetch(`${API_URL}/study-groups/${groupId}/posts?${params}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch group posts');
      }
      
      const result = await res.json();
      return result.data as GroupPost[];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useCreateGroupPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ groupId, body, pinned = false }: { groupId: string; body: string; pinned?: boolean }) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups/${groupId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ body, pinned })
      });
      
      if (!res.ok) {
        throw new Error('Failed to create group post');
      }
      
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group-posts', variables.groupId] });
    }
  });
}

export function useUpdateGroupPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, body }: { postId: string; body: string }) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ body })
      });
      
      if (!res.ok) {
        throw new Error('Failed to update group post');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-posts'] });
    }
  });
}

export function useDeleteGroupPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete group post');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-posts'] });
    }
  });
}

export function usePinGroupPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups/posts/${postId}/pin`, {
        method: 'PUT',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to pin group post');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-posts'] });
    }
  });
}

export function useUnpinGroupPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups/posts/${postId}/unpin`, {
        method: 'PUT',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to unpin group post');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-posts'] });
    }
  });
}

// Invite hooks
export function useSentInvites() {
  return useQuery({
    queryKey: ['sent-invites'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups/invites/sent`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch sent invites');
      }
      
      const result = await res.json();
      return result.data as GroupInvite[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useReceivedInvites() {
  return useQuery({
    queryKey: ['received-invites'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups/invites/received`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch received invites');
      }
      
      const result = await res.json();
      return result.data as GroupInvite[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useAcceptInvite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (inviteId: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups/invites/${inviteId}/accept`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to accept invite');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['received-invites'] });
      queryClient.invalidateQueries({ queryKey: ['my-study-groups'] });
    }
  });
}

export function useRejectInvite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (inviteId: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${API_URL}/study-groups/invites/${inviteId}/reject`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to reject invite');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['received-invites'] });
    }
  });
}
