"use client";

import { useState, useEffect, useRef } from "react";
import { 
  useConversations, 
  useConversation, 
  useMessages, 
  useSendMessage, 
  useMarkAllMessagesAsRead,
  useWebSocket,
  useTypingIndicator,
  ConversationList,
  MessageBubble,
  TypingIndicator,
  Conversation,
  Message,
  MessageType,
  OnlineStatus
} from "@cliniq/ui";

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");

  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: conversations } = useConversations();
  const { data: messages, isLoading: messagesLoading } = useMessages(selectedConversation?.id || '', { enabled: !!selectedConversation });
  const { data: _conversation } = useConversation(selectedConversation?.id || '', { enabled: !!selectedConversation });
  
  const sendMessageMutation = useSendMessage();
  const markAllAsReadMutation = useMarkAllMessagesAsRead();
  
  const { 
    onlineUsers, 
    typingIndicators, 
    isConnected, 
    joinRoom, 
    leaveRoom, 
    sendMessage, 
    startTyping: _startTyping, 
    stopTyping: _stopTyping, 
    updateStatus,
    markAsRead: _markAsRead,
    addReaction,
    removeReaction: _removeReaction
  } = useWebSocket();
  
  const { handleTypingStart, handleTypingStop } = useTypingIndicator(selectedConversation?.id || '');

  const [currentUserStatus, setCurrentUserStatus] = useState<OnlineStatus>(OnlineStatus.ONLINE);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join/leave rooms when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      joinRoom(selectedConversation.id);
      markAllAsReadMutation.mutate(selectedConversation.id);
      
      return () => {
        leaveRoom(selectedConversation.id);
      };
    }
  }, [selectedConversation, joinRoom, leaveRoom, markAllAsReadMutation]);

  // Handle online status changes
  useEffect(() => {
    updateStatus(currentUserStatus);
  }, [currentUserStatus, updateStatus]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    sendMessage(
      selectedConversation.id,
      messageInput.trim(),
      MessageType.TEXT,
      replyingTo?.id
    );
    setMessageInput("");
    setReplyingTo(null);
    handleTypingStop();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReply = (messageId: string) => {
    const message = messages?.find(m => m.id === messageId);
    if (message) {
      setReplyingTo(message);
      inputRef.current?.focus();
    }
  };

  const handleReact = (messageId: string, emoji: string) => {
    addReaction(messageId, emoji, selectedConversation?.id || '');
  };

  const handleEdit = (messageId: string, content: string) => {
    // This would open an edit modal or inline editing
    console.log('Edit message:', messageId, content);
  };

  const handleDelete = (messageId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      // This would call the delete mutation
      console.log('Delete message:', messageId);
    }
  };


  const getTypingUsers = () => {
    if (!selectedConversation) return [];
    
    const indicators = typingIndicators[selectedConversation.id] || [];
    return indicators
      .filter(indicator => indicator.userId !== 'current-user') // This would be actual user ID
      .map(indicator => ({
        id: indicator.userId,
        name: `User ${indicator.userId}`, // This would be actual user name
        avatarUrl: undefined,
      }));
  };

  // Removed unused getOtherParticipant function

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversation List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <ConversationList
          conversations={conversations || []}
          activeConversationId={selectedConversation?.id}
          onSelectConversation={setSelectedConversation}
          onlineUsers={onlineUsers}
          currentUserOnlineStatus={currentUserStatus}
          onStatusChange={setCurrentUserStatus}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedConversation.name || 'Conversation'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.type === 'DIRECT' 
                        ? `${onlineUsers.filter(u => u.status === OnlineStatus.ONLINE).length} online`
                        : `${selectedConversation.participantIds.length} members`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messagesLoading ? (
                <div className="text-center text-gray-500">Loading messages...</div>
              ) : messages && messages.length > 0 ? (
                <>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.senderId === 'current-user'} // This would be actual user ID
                      onReply={handleReply}
                      onReact={handleReact}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      canEdit={message.senderId === 'current-user'} // This would check permissions
                      canDelete={message.senderId === 'current-user'} // This would check permissions
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  <div className="text-lg mb-2">No messages yet</div>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              )}

              {/* Typing Indicator */}
              <TypingIndicator users={getTypingUsers()} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              {/* Reply Preview */}
              {replyingTo && (
                <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Replying to: {replyingTo.content.substring(0, 50)}...
                    </div>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-end gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  📎
                </button>
                
                <div className="flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      if (e.target.value) {
                        handleTypingStart();
                      } else {
                        handleTypingStop();
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    onFocus={handleTypingStart}
                    onBlur={handleTypingStop}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sendMessageMutation.isPending}
                  className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                >
                  {sendMessageMutation.isPending ? '⏳' : '➤'}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h2>
              <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
