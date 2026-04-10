"use client";

import { useState } from "react";
import { Conversation, OnlineStatus, formatChatTime, truncateMessage } from "@cliniq/shared-types";

// SVG icon helpers
const UserIcon = () => (
  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// Status dot component — uses solid colored circles (CSS), not emoji
const StatusDot = ({ status }: { status: OnlineStatus }) => {
  const colorMap: Record<string, string> = {
    [OnlineStatus.ONLINE]: "bg-green-500",
    [OnlineStatus.AWAY]: "bg-yellow-400",
    [OnlineStatus.BUSY]: "bg-red-500",
    [OnlineStatus.OFFLINE]: "bg-gray-400",
    [OnlineStatus.INVISIBLE]: "bg-gray-300",
  };

  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${colorMap[status] || "bg-gray-400"}`}
      aria-label={status.toLowerCase()}
    />
  );
};

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

  const getStatusColor = (status: OnlineStatus) => {
    const colors: Record<string, string> = {
      [OnlineStatus.ONLINE]: "bg-green-500",
      [OnlineStatus.AWAY]: "bg-yellow-400",
      [OnlineStatus.BUSY]: "bg-red-500",
      [OnlineStatus.OFFLINE]: "bg-gray-400",
      [OnlineStatus.INVISIBLE]: "bg-gray-300",
    };
    return colors[status] || "bg-gray-400";
  };

  const getStatusLabel = (status: OnlineStatus) => {
    const labels: Record<string, string> = {
      [OnlineStatus.ONLINE]: "Online",
      [OnlineStatus.AWAY]: "Away",
      [OnlineStatus.BUSY]: "Busy",
      [OnlineStatus.OFFLINE]: "Offline",
      [OnlineStatus.INVISIBLE]: "Invisible",
    };
    return labels[status] || "Offline";
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

    if (conversation.type === "DIRECT" && conversation.participantIds.length === 2) {
      const otherUserId = conversation.participantIds.find((id) => id !== "current-user");
      const status = otherUserId ? getOnlineStatus(otherUserId) : OnlineStatus.OFFLINE;

      return (
        <div className="relative">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            <UserIcon />
          </div>
          <div
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(status)}`}
          />
        </div>
      );
    }

    return (
      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
        <UsersIcon />
      </div>
    );
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) return conversation.name;
    if (conversation.type === "DIRECT") return "Direct Message";
    return "Unnamed Conversation";
  };

  const statusOptions = [
    { value: OnlineStatus.ONLINE, label: "Online" },
    { value: OnlineStatus.AWAY, label: "Away" },
    { value: OnlineStatus.BUSY, label: "Busy" },
    { value: OnlineStatus.INVISIBLE, label: "Invisible" },
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
              <StatusDot status={currentUserOnlineStatus} />
              <span className="text-sm text-gray-600">
                {getStatusLabel(currentUserOnlineStatus)}
              </span>
              <ChevronDownIcon />
            </button>

            {showStatusMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onStatusChange?.(option.value);
                      setShowStatusMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-left text-sm"
                  >
                    <StatusDot status={option.value} />
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm"
          />
          <span className="absolute left-3 top-2.5">
            <SearchIcon />
          </span>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <div className="text-base font-medium mb-1">No conversations</div>
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
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
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
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full flex-shrink-0 ml-2">
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
