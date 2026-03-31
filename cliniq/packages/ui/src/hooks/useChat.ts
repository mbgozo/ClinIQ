import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Conversation, 
  Message, 
  CreateConversationInput, 
  CreateMessageInput,
  OnlineStatus,
  TypingIndicator,
  SocketEvent,
  MessageType
} from '@cliniq/shared-types';

interface ChatHookOptions {
  apiUrl?: string;
}

export function useConversations(options: ChatHookOptions = {}) {
  const { apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000" } = options;

  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      
      const res = await fetch(`${apiUrl}/chat/conversations`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const result = await res.json();
      return result.data as Conversation[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useConversation(id: string, options: ChatHookOptions = {}) {
  const { apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000" } = options;

  return useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      
      const res = await fetch(`${apiUrl}/chat/conversations/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch conversation');
      }
      
      const result = await res.json();
      return result.data as Conversation;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useMessages(conversationId: string, options: ChatHookOptions = {}) {
  const { apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000" } = options;

  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      
      const res = await fetch(`${apiUrl}/chat/conversations/${conversationId}/messages?limit=50`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const result = await res.json();
      return result.data as Message[];
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCreateConversation(options: ChatHookOptions = {}) {
  const queryClient = useQueryClient();
  const { apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000" } = options;

  return useMutation({
    mutationFn: async (data: CreateConversationInput) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      
      const res = await fetch(`${apiUrl}/chat/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        throw new Error('Failed to create conversation');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
}

export function useSendMessage(options: ChatHookOptions = {}) {
  const queryClient = useQueryClient();
  const { apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000" } = options;

  return useMutation({
    mutationFn: async ({ conversationId, content, type = MessageType.TEXT, replyToId }: {
      conversationId: string;
      content: string;
      type?: MessageType;
      replyToId?: string;
    }) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      
      const res = await fetch(`${apiUrl}/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ content, type, replyToId })
      });
      
      if (!res.ok) {
        throw new Error('Failed to send message');
      }
      
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
}

export function useMarkMessageAsRead(options: ChatHookOptions = {}) {
  const queryClient = useQueryClient();
  const { apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000" } = options;

  return useMutation({
    mutationFn: async (messageId: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      
      const res = await fetch(`${apiUrl}/chat/messages/${messageId}/read`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to mark message as read');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
}

export function useMarkAllMessagesAsRead(options: ChatHookOptions = {}) {
  const queryClient = useQueryClient();
  const { apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000" } = options;

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      
      const res = await fetch(`${apiUrl}/chat/conversations/${conversationId}/read-all`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to mark all messages as read');
      }
      
      return res.json();
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
    }
  });
}

export function useOnlineUsers(options: ChatHookOptions = {}) {
  const { apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000" } = options;

  return useQuery({
    queryKey: ['online-users'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
      
      const res = await fetch(`${apiUrl}/chat/online-users`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch online users');
      }
      
      const result = await res.json();
      return result.data as Array<{ userId: string; status: OnlineStatus; lastSeenAt?: string }>;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Array<{ userId: string; status: OnlineStatus; lastSeenAt?: string }>>([]);
  const [typingIndicators, setTypingIndicators] = useState<Record<string, TypingIndicator[]>>({});
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cliniq_access_token') : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    if (token) {
      const newSocket = io(`${apiUrl}/chat`, {
        auth: { token },
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Connected to chat server');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from chat server');
      });

      // Online status updates
      newSocket.on('online_status', (users: any[]) => {
        setOnlineUsers(users);
      });

      newSocket.on('user_online', (data: any) => {
        setOnlineUsers(prev => {
          const filtered = prev.filter(u => u.userId !== data.userId);
          return [...filtered, { userId: data.userId, status: data.status }];
        });
      });

      newSocket.on('user_offline', (data: any) => {
        setOnlineUsers(prev => 
          prev.map(u => u.userId === data.userId ? { ...u, status: data.status } : u)
        );
      });

      // Typing indicators
      newSocket.on('typing_start', (data: any) => {
        setTypingIndicators(prev => ({
          ...prev,
          [data.conversationId]: data.typingIndicators || []
        }));
      });

      newSocket.on('typing_stop', (data: any) => {
        setTypingIndicators(prev => ({
          ...prev,
          [data.conversationId]: data.typingIndicators || []
        }));
      });

      // New messages
      newSocket.on('new_message', (message: Message) => {
        queryClient.setQueryData(['messages', message.conversationId], (old: Message[] | undefined) => {
          if (!old) return [message];
          return [...old, message];
        });
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      });

      // Message read receipts
      newSocket.on('message_read', (data: any) => {
        queryClient.setQueryData(['messages', data.conversationId], (old: Message[] | undefined) => {
          if (!old) return old;
          return old.map(msg => 
            msg.id === data.messageId ? { ...msg, readAt: new Date().toISOString() } : msg
          );
        });
      });

      // Reactions
      newSocket.on('reaction_added', (data: any) => {
        queryClient.setQueryData(['messages', data.conversationId], (old: Message[] | undefined) => {
          if (!old) return old;
          return old.map(msg => 
            msg.id === data.messageId ? { ...msg, reactions: data.reaction } : msg
          );
        });
      });

      newSocket.on('reaction_removed', (data: any) => {
        queryClient.setQueryData(['messages', data.conversationId], (old: Message[] | undefined) => {
          if (!old) return old;
          return old.map(msg => 
            msg.id === data.messageId ? { ...msg, reactions: data.reaction } : msg
          );
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [queryClient]);

  const joinRoom = (conversationId: string) => {
    if (socket) {
      socket.emit('join_room', { conversationId });
    }
  };

  const leaveRoom = (conversationId: string) => {
    if (socket) {
      socket.emit('leave_room', { conversationId });
    }
  };

  const sendMessage = (conversationId: string, content: string, type: MessageType = MessageType.TEXT, replyToId?: string) => {
    if (socket) {
      socket.emit('send_message', { conversationId, content, type, replyToId });
    }
  };

  const startTyping = (conversationId: string) => {
    if (socket) {
      socket.emit('typing_start', { conversationId });
    }
  };

  const stopTyping = (conversationId: string) => {
    if (socket) {
      socket.emit('typing_stop', { conversationId });
    }
  };

  const updateStatus = (status: OnlineStatus) => {
    if (socket) {
      socket.emit('update_status', { status });
    }
  };

  const markAsRead = (messageId: string, conversationId: string) => {
    if (socket) {
      socket.emit('message_read', { messageId, conversationId });
    }
  };

  const addReaction = (messageId: string, emoji: string, conversationId: string) => {
    if (socket) {
      socket.emit('add_reaction', { messageId, emoji, conversationId });
    }
  };

  const removeReaction = (messageId: string, emoji: string, conversationId: string) => {
    if (socket) {
      socket.emit('remove_reaction', { messageId, emoji, conversationId });
    }
  };

  return {
    socket,
    isConnected,
    onlineUsers,
    typingIndicators,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
    updateStatus,
    markAsRead,
    addReaction,
    removeReaction,
  };
}

export function useTypingIndicator(conversationId: string, debounceMs = 300) {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { startTyping, stopTyping } = useWebSocket();

  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      startTyping(conversationId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(conversationId);
    }, debounceMs);
  };

  const handleTypingStop = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (isTyping) {
      setIsTyping(false);
      stopTyping(conversationId);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    isTyping,
    handleTypingStart,
    handleTypingStop,
  };
}
