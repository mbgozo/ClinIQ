import { useState } from "react";
import { Conversation, OnlineStatus, formatChatTime, truncateMessage } from "@cliniq/shared-types";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
  onlineUsers: { userId: string; status: OnlineStatus; lastSeenAt?: string }[];
  currentUserOnlineStatus: OnlineStatus;
  onStatusChange?: (status: OnlineStatus) => void;
  className?: string;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onlineUsers,
  currentUserOnlineStatus,
  onStatusChange,
  className = "",
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getOnlineStatus = (userId: string) => {
    const user = onlineUsers.find((u) => u.userId === userId);
    return user?.status || OnlineStatus.OFFLINE;
  };

  const getStatusIcon = (status: OnlineStatus) => {
    const icons = {
      [OnlineStatus.ONLINE]: "🟢",
      [OnlineStatus.AWAY]: "🟡",
      [OnlineStatus.BUSY]: "🔴",
      [OnlineStatus.OFFLINE]: "⚫",
      [OnlineStatus.INVISIBLE]: "👁️‍🗨️",
    };
    return icons[status] || "⚫";
  };

  const getStatusColor = (status: OnlineStatus) => {
    const colors = {
      [OnlineStatus.ONLINE]: "bg-green-500",
      [OnlineStatus.AWAY]: "bg-yellow-500",
      [OnlineStatus.BUSY]: "bg-red-500",
      [OnlineStatus.OFFLINE]: "bg-gray-400",
      [OnlineStatus.INVISIBLE]: "bg-gray-400",
    };
    return colors[status] || "bg-gray-400";
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.avatarUrl) {
      return (
        <img
          src={conversation.avatarUrl}
          alt={conversation.name}
          className="h-12 w-12 rounded-full object-cover"
        />
      );
    }

    // For direct messages, show online status indicator
    if (conversation.type === "DIRECT" && conversation.participantIds.length === 2) {
      const otherUserId = conversation.participantIds.find((id) => id !== "current-user"); // This would be actual user ID
      const status = otherUserId ? getOnlineStatus(otherUserId) : OnlineStatus.OFFLINE;

      return (
        <div className="relative">
          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(status)}`}
          />
        </div>
      );
    }

    return (
      <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
        <span className="text-lg">👥</span>
      </div>
    );
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) return conversation.name;

    // For direct messages, this would show the other user's name
    if (conversation.type === "DIRECT") {
      return "Direct Message";
    }

    return "Unnamed Conversation";
  };

  const getStatusOptions = () => [
    { value: OnlineStatus.ONLINE, label: "Online", icon: "🟢" },
    { value: OnlineStatus.AWAY, label: "Away", icon: "🟡" },
    { value: OnlineStatus.BUSY, label: "Busy", icon: "🔴" },
    { value: OnlineStatus.INVISIBLE, label: "Invisible", icon: "👁️‍🗨️" },
  ];

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header with status */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>

          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>{getStatusIcon(currentUserOnlineStatus)}</span>
              <span className="text-sm text-gray-600">
                {getStatusOptions().find((s) => s.value === currentUserOnlineStatus)?.label}
              </span>
            </button>

            {showStatusMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg py-1 z-10">
                {getStatusOptions().map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onStatusChange?.(option.value);
                      setShowStatusMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-left text-sm"
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <div className="text-lg mb-2">No conversations</div>
            <p className="text-sm">
              {searchQuery ? "Try a different search term" : "Start a conversation to see it here"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredConversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;
              const unreadCount = conversation.unreadCount || 0;

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${
                    isActive ? "bg-teal-50 border-l-4 border-teal-600" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">{getConversationAvatar(conversation)}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-medium truncate ${
                            isActive ? "text-teal-900" : "text-gray-900"
                          }`}
                        >
                          {getConversationName(conversation)}
                        </h3>
                        {conversation.lastMessageAt && (
                          <span className="text-xs text-gray-500">
                            {formatChatTime(conversation.lastMessageAt)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm truncate ${
                            isActive ? "text-teal-700" : "text-gray-600"
                          }`}
                        >
                          {conversation.lastMessage
                            ? truncateMessage(conversation.lastMessage, 40)
                            : "No messages yet"}
                        </p>

                        {unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
