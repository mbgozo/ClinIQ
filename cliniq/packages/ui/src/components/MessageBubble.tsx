import { useState } from 'react';
import { Message, MessageType, MESSAGE_TYPE_DEFINITIONS } from '@cliniq/shared-types';

// SVG icon helpers
const ReplyIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
);

const EditIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SmileIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// Minimal text tickers for message status (not emoji)
const getStatusMark = (status: string) => {
  switch (status) {
    case 'SENDING': return <span className="text-yellow-500 text-xs">···</span>;
    case 'SENT': return <span className="text-gray-400 text-xs">✓</span>;
    case 'DELIVERED': return <span className="text-gray-400 text-xs">✓✓</span>;
    case 'READ': return <span className="text-teal-400 text-xs">✓✓</span>;
    case 'FAILED': return (
      <svg className="h-3 w-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
    default: return null;
  }
};

// Common quick reactions using text characters (not emoji) — these are a chat feature
// keeping them as they're core UX for a messaging UI, but scoped to the reaction picker only
const QUICK_REACTIONS = ['+1', 'heart', 'laugh', 'wow', 'sad', 'clap'];
const reactionLabels: Record<string, string> = {
  '+1': '👍', 'heart': '❤️', 'laugh': '😂', 'wow': '😮', 'sad': '😢', 'clap': '👏',
};

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showTimestamp?: boolean;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  className?: string;
}

export function MessageBubble({ 
  message, 
  isOwn, 
  showTimestamp = true,
  onReply,
  onReact,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
  className = ''
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent);
    }
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            rows={3}
            maxLength={2000}
          />
          <div className="flex gap-2">
            <button onClick={handleSaveEdit} className="rounded bg-teal-600 px-3 py-1 text-xs font-medium text-white hover:bg-teal-700">Save</button>
            <button onClick={handleCancelEdit} className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      );
    }

    switch (message.type) {
      case MessageType.TEXT:
        return <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>;
      
      case MessageType.IMAGE:
        return (
          <div className="space-y-2">
            <img 
              src={message.fileUrl} 
              alt={message.fileName}
              className="max-w-sm rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.fileUrl, '_blank')}
            />
            {message.fileName && <p className="text-xs opacity-75">{message.fileName}</p>}
          </div>
        );
      
      case MessageType.FILE:
        return (
          <div className="flex items-center gap-3 p-3 bg-black/10 rounded-lg">
            <DocumentIcon />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.fileName}</p>
              {message.fileSize && (
                <p className="text-xs opacity-75">{formatFileSize(message.fileSize)}</p>
              )}
            </div>
            <button
              onClick={() => message.fileUrl && window.open(message.fileUrl, '_blank')}
              className="flex items-center gap-1 rounded bg-white/20 px-3 py-1 text-xs font-medium hover:bg-white/30 transition-colors flex-shrink-0"
            >
              <DownloadIcon />
            </button>
          </div>
        );
      
      default:
        return <p className="text-sm">{message.content}</p>;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${className}`}>
      <div className={`max-w-lg lg:max-w-xl ${isOwn ? 'order-2' : 'order-1'}`}>
        <div
          className={`relative group rounded-lg px-4 py-2 ${
            isOwn 
              ? 'bg-teal-600 text-white' 
              : 'bg-gray-100 text-gray-900'
          }`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {/* Reply indicator */}
          {message.replyToId && (
            <div className={`text-xs mb-1 opacity-75 flex items-center gap-1 ${isOwn ? 'text-teal-100' : 'text-gray-500'}`}>
              <ReplyIcon />
              Replying to a message
            </div>
          )}

          {/* Message content */}
          {renderContent()}

          {/* Timestamp and status */}
          {showTimestamp && (
            <div className={`flex items-center justify-between mt-1 text-xs ${isOwn ? 'text-teal-100' : 'text-gray-500'}`}>
              <span>{formatTime(message.createdAt)}</span>
              {isOwn && <span className="ml-2">{getStatusMark(message.status)}</span>}
            </div>
          )}

          {/* Hover action bar */}
          {showActions && !isEditing && (
            <div className={`absolute top-2 ${isOwn ? 'left-0 -translate-x-full pr-1' : 'right-0 translate-x-full pl-1'} flex flex-col gap-1`}>
              <div className="bg-white border rounded-lg shadow-lg p-1 flex flex-col gap-1">
                <button
                  onClick={() => onReply?.(message.id)}
                  className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                  title="Reply"
                >
                  <ReplyIcon />
                </button>
                
                {canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                    title="Edit"
                  >
                    <EditIcon />
                  </button>
                )}
                
                {canDelete && (
                  <button
                    onClick={() => onDelete?.(message.id)}
                    className="p-1.5 hover:bg-gray-100 rounded text-red-600 transition-colors"
                    title="Delete"
                  >
                    <TrashIcon />
                  </button>
                )}
                
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                  title="Add reaction"
                >
                  <SmileIcon />
                </button>
              </div>
            </div>
          )}

          {/* Quick reaction picker */}
          {showEmojiPicker && (
            <div className={`absolute bottom-full mb-2 ${isOwn ? 'right-0' : 'left-0'} bg-white border rounded-lg shadow-lg p-2 z-10`}>
              <div className="flex gap-1">
                {QUICK_REACTIONS.map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      onReact?.(message.id, reactionLabels[key]);
                      setShowEmojiPicker(false);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded text-base transition-colors"
                    title={key}
                  >
                    {reactionLabels[key]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reactions display */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {message.reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => onReact?.(message.id, reaction.emoji)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
                  isOwn 
                    ? 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100' 
                    : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
