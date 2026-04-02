import { z } from "zod";
export declare enum MessageType {
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
    READ_RECEIPT = "READ_RECEIPT"
}
export declare enum ChatType {
    DIRECT = "DIRECT",
    GROUP = "GROUP",
    STUDY_GROUP = "STUDY_GROUP",
    MENTORSHIP = "MENTORSHIP"
}
export declare enum MessageStatus {
    SENDING = "SENDING",
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    READ = "READ",
    FAILED = "FAILED"
}
export declare enum OnlineStatus {
    ONLINE = "ONLINE",
    AWAY = "AWAY",
    BUSY = "BUSY",
    OFFLINE = "OFFLINE",
    INVISIBLE = "INVISIBLE"
}
export declare const MessageSchema: z.ZodObject<{
    id: z.ZodString;
    conversationId: z.ZodString;
    senderId: z.ZodString;
    type: z.ZodNativeEnum<typeof MessageType>;
    content: z.ZodString;
    status: z.ZodNativeEnum<typeof MessageStatus>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    readAt: z.ZodOptional<z.ZodString>;
    fileUrl: z.ZodOptional<z.ZodString>;
    fileName: z.ZodOptional<z.ZodString>;
    fileSize: z.ZodOptional<z.ZodNumber>;
    mimeType: z.ZodOptional<z.ZodString>;
    replyToId: z.ZodOptional<z.ZodString>;
    reactions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        emoji: z.ZodString;
        userIds: z.ZodArray<z.ZodString, "many">;
        count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        count: number;
        emoji: string;
        userIds: string[];
    }, {
        count: number;
        emoji: string;
        userIds: string[];
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    type: MessageType;
    id: string;
    content: string;
    status: MessageStatus;
    createdAt: string;
    updatedAt: string;
    conversationId: string;
    senderId: string;
    readAt?: string | undefined;
    fileUrl?: string | undefined;
    fileName?: string | undefined;
    fileSize?: number | undefined;
    mimeType?: string | undefined;
    replyToId?: string | undefined;
    reactions?: {
        count: number;
        emoji: string;
        userIds: string[];
    }[] | undefined;
}, {
    type: MessageType;
    id: string;
    content: string;
    status: MessageStatus;
    createdAt: string;
    updatedAt: string;
    conversationId: string;
    senderId: string;
    readAt?: string | undefined;
    fileUrl?: string | undefined;
    fileName?: string | undefined;
    fileSize?: number | undefined;
    mimeType?: string | undefined;
    replyToId?: string | undefined;
    reactions?: {
        count: number;
        emoji: string;
        userIds: string[];
    }[] | undefined;
}>;
export type Message = z.infer<typeof MessageSchema>;
export declare const CreateMessageSchema: z.ZodObject<{
    conversationId: z.ZodString;
    type: z.ZodNativeEnum<typeof MessageType>;
    content: z.ZodString;
    replyToId: z.ZodOptional<z.ZodString>;
    fileUrl: z.ZodOptional<z.ZodString>;
    fileName: z.ZodOptional<z.ZodString>;
    fileSize: z.ZodOptional<z.ZodNumber>;
    mimeType: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: MessageType;
    content: string;
    conversationId: string;
    fileUrl?: string | undefined;
    fileName?: string | undefined;
    fileSize?: number | undefined;
    mimeType?: string | undefined;
    replyToId?: string | undefined;
}, {
    type: MessageType;
    content: string;
    conversationId: string;
    fileUrl?: string | undefined;
    fileName?: string | undefined;
    fileSize?: number | undefined;
    mimeType?: string | undefined;
    replyToId?: string | undefined;
}>;
export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
export declare const ConversationSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodNativeEnum<typeof ChatType>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodString>;
    participantIds: z.ZodArray<z.ZodString, "many">;
    lastMessage: z.ZodOptional<z.ZodString>;
    lastMessageAt: z.ZodOptional<z.ZodString>;
    unreadCount: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    isArchived: z.ZodOptional<z.ZodBoolean>;
    isMuted: z.ZodOptional<z.ZodBoolean>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    type: ChatType;
    id: string;
    createdAt: string;
    updatedAt: string;
    participantIds: string[];
    name?: string | undefined;
    description?: string | undefined;
    avatarUrl?: string | undefined;
    lastMessage?: string | undefined;
    lastMessageAt?: string | undefined;
    unreadCount?: number | undefined;
    isArchived?: boolean | undefined;
    isMuted?: boolean | undefined;
    metadata?: Record<string, any> | undefined;
}, {
    type: ChatType;
    id: string;
    createdAt: string;
    updatedAt: string;
    participantIds: string[];
    name?: string | undefined;
    description?: string | undefined;
    avatarUrl?: string | undefined;
    lastMessage?: string | undefined;
    lastMessageAt?: string | undefined;
    unreadCount?: number | undefined;
    isArchived?: boolean | undefined;
    isMuted?: boolean | undefined;
    metadata?: Record<string, any> | undefined;
}>;
export type Conversation = z.infer<typeof ConversationSchema>;
export declare const CreateConversationSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof ChatType>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    participantIds: z.ZodArray<z.ZodString, "many">;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    type: ChatType;
    participantIds: string[];
    name?: string | undefined;
    description?: string | undefined;
    metadata?: Record<string, any> | undefined;
}, {
    type: ChatType;
    participantIds: string[];
    name?: string | undefined;
    description?: string | undefined;
    metadata?: Record<string, any> | undefined;
}>;
export type CreateConversationInput = z.infer<typeof CreateConversationSchema>;
export declare const ParticipantSchema: z.ZodObject<{
    id: z.ZodString;
    conversationId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodEnum<["OWNER", "ADMIN", "MEMBER"]>;
    joinedAt: z.ZodString;
    lastReadAt: z.ZodOptional<z.ZodString>;
    isTyping: z.ZodOptional<z.ZodBoolean>;
    typingAt: z.ZodOptional<z.ZodString>;
    onlineStatus: z.ZodNativeEnum<typeof OnlineStatus>;
    lastSeenAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    userId: string;
    joinedAt: string;
    conversationId: string;
    onlineStatus: OnlineStatus;
    lastReadAt?: string | undefined;
    isTyping?: boolean | undefined;
    typingAt?: string | undefined;
    lastSeenAt?: string | undefined;
}, {
    id: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    userId: string;
    joinedAt: string;
    conversationId: string;
    onlineStatus: OnlineStatus;
    lastReadAt?: string | undefined;
    isTyping?: boolean | undefined;
    typingAt?: string | undefined;
    lastSeenAt?: string | undefined;
}>;
export type Participant = z.infer<typeof ParticipantSchema>;
export declare const TypingIndicatorSchema: z.ZodObject<{
    conversationId: z.ZodString;
    userId: z.ZodString;
    isTyping: z.ZodBoolean;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    conversationId: string;
    isTyping: boolean;
    timestamp: string;
}, {
    userId: string;
    conversationId: string;
    isTyping: boolean;
    timestamp: string;
}>;
export type TypingIndicator = z.infer<typeof TypingIndicatorSchema>;
export declare const OnlineStatusSchema: z.ZodObject<{
    userId: z.ZodString;
    status: z.ZodNativeEnum<typeof OnlineStatus>;
    lastSeenAt: z.ZodOptional<z.ZodString>;
    socketId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: OnlineStatus;
    userId: string;
    lastSeenAt?: string | undefined;
    socketId?: string | undefined;
}, {
    status: OnlineStatus;
    userId: string;
    lastSeenAt?: string | undefined;
    socketId?: string | undefined;
}>;
export type OnlineStatusUpdate = z.infer<typeof OnlineStatusSchema>;
export declare const MESSAGE_TYPE_DEFINITIONS: {
    TEXT: {
        name: string;
        icon: string;
        color: string;
        maxLength: number;
    };
    IMAGE: {
        name: string;
        icon: string;
        color: string;
        maxSize: number;
        allowedTypes: string[];
    };
    FILE: {
        name: string;
        icon: string;
        color: string;
        maxSize: number;
    };
    SYSTEM: {
        name: string;
        icon: string;
        color: string;
    };
    TYPING: {
        name: string;
        icon: string;
        color: string;
    };
    STOP_TYPING: {
        name: string;
        icon: string;
        color: string;
    };
    ONLINE: {
        name: string;
        icon: string;
        color: string;
    };
    OFFLINE: {
        name: string;
        icon: string;
        color: string;
    };
    JOIN: {
        name: string;
        icon: string;
        color: string;
    };
    LEAVE: {
        name: string;
        icon: string;
        color: string;
    };
    READ_RECEIPT: {
        name: string;
        icon: string;
        color: string;
    };
};
export declare const CHAT_TYPE_DEFINITIONS: {
    DIRECT: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    GROUP: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    STUDY_GROUP: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    MENTORSHIP: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
};
export declare const ONLINE_STATUS_DEFINITIONS: {
    ONLINE: {
        name: string;
        icon: string;
        color: string;
        description: string;
    };
    AWAY: {
        name: string;
        icon: string;
        color: string;
        description: string;
    };
    BUSY: {
        name: string;
        icon: string;
        color: string;
        description: string;
    };
    OFFLINE: {
        name: string;
        icon: string;
        color: string;
        description: string;
    };
    INVISIBLE: {
        name: string;
        icon: string;
        color: string;
        description: string;
    };
};
export declare const MESSAGE_STATUS_DEFINITIONS: {
    SENDING: {
        name: string;
        icon: string;
        color: string;
    };
    SENT: {
        name: string;
        icon: string;
        color: string;
    };
    DELIVERED: {
        name: string;
        icon: string;
        color: string;
    };
    READ: {
        name: string;
        icon: string;
        color: string;
    };
    FAILED: {
        name: string;
        icon: string;
        color: string;
    };
};
export declare function formatMessageTime(dateString: string): string;
export declare function formatChatTime(dateString: string): string;
export declare function truncateMessage(content: string, maxLength?: number): string;
export declare function getFileIcon(fileName: string): string;
export declare function getConversationName(conversation: Conversation, userId: string): string;
export declare function isUserOnline(lastSeenAt?: string): boolean;
export declare function getTypingUsers(typingIndicators: TypingIndicator[], currentUserId: string): string[];
export declare function canSendMessage(conversation: Conversation, userId: string): boolean;
export declare function getUnreadCount(conversation: Conversation, _userId: string): number;
export declare function generateMessageId(): string;
export declare function generateConversationId(): string;
export declare enum SocketEvent {
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
    ERROR = "error"
}
export interface SocketMessage {
    event: SocketEvent;
    data: any;
    timestamp: string;
    userId?: string;
    conversationId?: string;
}
//# sourceMappingURL=chat.d.ts.map