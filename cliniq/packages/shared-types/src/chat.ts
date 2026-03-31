import { z } from "zod";

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
  SYSTEM = "SYSTEM",
  TYPING = "TYPING",
  STOP_TYPING = "STOP_TYPING",
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  READ_RECEIPT = "READ_RECEIPT",
}

export enum ChatType {
  DIRECT = "DIRECT",
  GROUP = "GROUP",
  STUDY_GROUP = "STUDY_GROUP",
  MENTORSHIP = "MENTORSHIP",
}

export enum MessageStatus {
  SENDING = "SENDING",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
  FAILED = "FAILED",
}

export enum OnlineStatus {
  ONLINE = "ONLINE",
  AWAY = "AWAY",
  BUSY = "BUSY",
  OFFLINE = "OFFLINE",
  INVISIBLE = "INVISIBLE",
}

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  type: z.nativeEnum(MessageType),
  content: z.string(),
  status: z.nativeEnum(MessageStatus),
  createdAt: z.string(),
  updatedAt: z.string(),
  readAt: z.string().optional(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  replyToId: z.string().optional(),
  reactions: z.array(z.object({
    emoji: z.string(),
    userIds: z.array(z.string()),
    count: z.number(),
  })).optional(),
});

export type Message = z.infer<typeof MessageSchema>;

export const CreateMessageSchema = z.object({
  conversationId: z.string(),
  type: z.nativeEnum(MessageType),
  content: z.string().min(1).max(2000),
  replyToId: z.string().optional(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
});

export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;

export const ConversationSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(ChatType),
  name: z.string().optional(),
  description: z.string().optional(),
  avatarUrl: z.string().optional(),
  participantIds: z.array(z.string()),
  lastMessage: z.string().optional(),
  lastMessageAt: z.string().optional(),
  unreadCount: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isArchived: z.boolean().optional(),
  isMuted: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export type Conversation = z.infer<typeof ConversationSchema>;

export const CreateConversationSchema = z.object({
  type: z.nativeEnum(ChatType),
  name: z.string().optional(),
  description: z.string().optional(),
  participantIds: z.array(z.string()).min(1),
  metadata: z.record(z.any()).optional(),
});

export type CreateConversationInput = z.infer<typeof CreateConversationSchema>;

export const ParticipantSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  userId: z.string(),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
  joinedAt: z.string(),
  lastReadAt: z.string().optional(),
  isTyping: z.boolean().optional(),
  typingAt: z.string().optional(),
  onlineStatus: z.nativeEnum(OnlineStatus),
  lastSeenAt: z.string().optional(),
});

export type Participant = z.infer<typeof ParticipantSchema>;

export const TypingIndicatorSchema = z.object({
  conversationId: z.string(),
  userId: z.string(),
  isTyping: z.boolean(),
  timestamp: z.string(),
});

export type TypingIndicator = z.infer<typeof TypingIndicatorSchema>;

export const OnlineStatusSchema = z.object({
  userId: z.string(),
  status: z.nativeEnum(OnlineStatus),
  lastSeenAt: z.string().optional(),
  socketId: z.string().optional(),
});

export type OnlineStatusUpdate = z.infer<typeof OnlineStatusSchema>;

// Message type definitions
export const MESSAGE_TYPE_DEFINITIONS = {
  [MessageType.TEXT]: {
    name: "Text",
    icon: "💬",
    color: "#3B82F6",
    maxLength: 2000,
  },
  [MessageType.IMAGE]: {
    name: "Image",
    icon: "🖼️",
    color: "#10B981",
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  },
  [MessageType.FILE]: {
    name: "File",
    icon: "📎",
    color: "#F59E0B",
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  [MessageType.SYSTEM]: {
    name: "System",
    icon: "🔧",
    color: "#6B7280",
  },
  [MessageType.TYPING]: {
    name: "Typing",
    icon: "⌨️",
    color: "#8B5CF6",
  },
  [MessageType.STOP_TYPING]: {
    name: "Stop Typing",
    icon: "✋",
    color: "#8B5CF6",
  },
  [MessageType.ONLINE]: {
    name: "Online",
    icon: "🟢",
    color: "#10B981",
  },
  [MessageType.OFFLINE]: {
    name: "Offline",
    icon: "🔴",
    color: "#EF4444",
  },
  [MessageType.JOIN]: {
    name: "Join",
    icon: "👋",
    color: "#10B981",
  },
  [MessageType.LEAVE]: {
    name: "Leave",
    icon: "👋",
    color: "#EF4444",
  },
  [MessageType.READ_RECEIPT]: {
    name: "Read Receipt",
    icon: "✓",
    color: "#6B7280",
  },
};

// Chat type definitions
export const CHAT_TYPE_DEFINITIONS = {
  [ChatType.DIRECT]: {
    name: "Direct Message",
    description: "One-on-one conversation",
    icon: "💬",
    color: "#3B82F6",
  },
  [ChatType.GROUP]: {
    name: "Group Chat",
    description: "Multi-person conversation",
    icon: "👥",
    color: "#10B981",
  },
  [ChatType.STUDY_GROUP]: {
    name: "Study Group",
    description: "Study group discussion",
    icon: "📚",
    color: "#F59E0B",
  },
  [ChatType.MENTORSHIP]: {
    name: "Mentorship",
    description: "Mentorship conversation",
    icon: "👨‍🏫",
    color: "#8B5CF6",
  },
};

// Online status definitions
export const ONLINE_STATUS_DEFINITIONS = {
  [OnlineStatus.ONLINE]: {
    name: "Online",
    icon: "🟢",
    color: "#10B981",
    description: "Active and available",
  },
  [OnlineStatus.AWAY]: {
    name: "Away",
    icon: "🟡",
    color: "#F59E0B",
    description: "Away from keyboard",
  },
  [OnlineStatus.BUSY]: {
    name: "Busy",
    icon: "🔴",
    color: "#EF4444",
    description: "Busy and unavailable",
  },
  [OnlineStatus.OFFLINE]: {
    name: "Offline",
    icon: "⚫",
    color: "#6B7280",
    description: "Offline",
  },
  [OnlineStatus.INVISIBLE]: {
    name: "Invisible",
    icon: "👁️‍🗨️",
    color: "#6B7280",
    description: "Appears offline to others",
  },
};

// Message status definitions
export const MESSAGE_STATUS_DEFINITIONS = {
  [MessageStatus.SENDING]: {
    name: "Sending",
    icon: "⏳",
    color: "#F59E0B",
  },
  [MessageStatus.SENT]: {
    name: "Sent",
    icon: "✓",
    color: "#6B7280",
  },
  [MessageStatus.DELIVERED]: {
    name: "Delivered",
    icon: "✓✓",
    color: "#6B7280",
  },
  [MessageStatus.READ]: {
    name: "Read",
    icon: "✓✓",
    color: "#10B981",
  },
  [MessageStatus.FAILED]: {
    name: "Failed",
    icon: "❌",
    color: "#EF4444",
  },
};

// Helper functions
export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
  if (diffMinutes < 10080) return `${Math.floor(diffMinutes / 1440)}d ago`;
  
  return date.toLocaleDateString();
}

export function formatChatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  // If same day, show time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // If yesterday, show "Yesterday"
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // If this week, show day name
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  
  // Otherwise show date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function truncateMessage(content: string, maxLength: number = 50): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
}

export function getFileIcon(fileName: string): string {
  const extension = fileName.toLowerCase().split('.').pop();
  
  const iconMap: Record<string, string> = {
    'pdf': '📄',
    'doc': '📝',
    'docx': '📝',
    'txt': '📄',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️',
    'mp4': '🎥',
    'avi': '🎥',
    'mov': '🎥',
    'mp3': '🎵',
    'wav': '🎵',
    'zip': '📦',
    'rar': '📦',
  };
  
  return iconMap[extension || ''] || '📎';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getConversationName(conversation: Conversation, userId: string): string {
  if (conversation.name) return conversation.name;
  
  // For direct messages, use the other participant's name
  if (conversation.type === ChatType.DIRECT && conversation.participantIds.length === 2) {
    const otherUserId = conversation.participantIds.find(id => id !== userId);
    return otherUserId || 'Unknown';
  }
  
  return 'Unnamed Conversation';
}

export function isUserOnline(lastSeenAt?: string): boolean {
  if (!lastSeenAt) return false;
  
  const lastSeen = new Date(lastSeenAt);
  const now = new Date();
  const diffMinutes = Math.abs(now.getTime() - lastSeen.getTime()) / (1000 * 60);
  
  return diffMinutes < 5; // Consider online if seen within last 5 minutes
}

export function getTypingUsers(typingIndicators: TypingIndicator[], currentUserId: string): string[] {
  return typingIndicators
    .filter(indicator => indicator.isTyping && indicator.userId !== currentUserId)
    .map(indicator => indicator.userId);
}

export function canSendMessage(conversation: Conversation, userId: string): boolean {
  // Check if user is a participant
  return conversation.participantIds.includes(userId);
}

export function getUnreadCount(conversation: Conversation, userId: string): number {
  // This would be calculated based on user's last read message
  // For now, return the stored unread count
  return conversation.unreadCount || 0;
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// WebSocket event types
export enum SocketEvent {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  JOIN_ROOM = "join_room",
  LEAVE_ROOM = "leave_room",
  SEND_MESSAGE = "send_message",
  NEW_MESSAGE = "new_message",
  TYPING_START = "typing_start",
  TYPING_STOP = "typing_stop",
  ONLINE_STATUS = "online_status",
  MESSAGE_READ = "message_read",
  ERROR = "error",
}

export interface SocketMessage {
  event: SocketEvent;
  data: any;
  timestamp: string;
  userId?: string;
  conversationId?: string;
}
