import { useState } from 'react';
import { Message, MessageType, MESSAGE_TYPE_DEFINITIONS } from '@cliniq/shared-types';

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
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'SENDING': return '⏳';
      case 'SENT': return '✓';
      case 'DELIVERED': return '✓✓';
      case 'READ': return '✓✓';
      case 'FAILED': return '❌';
      default: return '';
    }
  };

  const getStatusColor = () => {
    switch (message.status) {
      case 'SENDING': return 'text-yellow-500';
      case 'SENT': return 'text-gray-400';
      case 'DELIVERED': return 'text-gray-400';
      case 'READ': return 'text-teal-500';
      case 'FAILED': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getMessageIcon = () => {
    const typeDef = MESSAGE_TYPE_DEFINITIONS[message.type];
    return typeDef?.icon || '💬';
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

  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '👏', '🔥', '🎉', '💯', '🙏'];

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
            <button
              onClick={handleSaveEdit}
              className="rounded bg-teal-600 px-3 py-1 text-xs font-medium text-white hover:bg-teal-700"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    switch (message.type) {
      case MessageType.TEXT:
        return <p className="text-gray-900 whitespace-pre-wrap break-words">{message.content}</p>;
      
      case MessageType.IMAGE:
        return (
          <div className="space-y-2">
            <img 
              src={message.fileUrl} 
              alt={message.fileName}
              className="max-w-sm rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.fileUrl, '_blank')}
            />
            {message.fileName && (
              <p className="text-xs text-gray-500">{message.fileName}</p>
            )}
          </div>
        );
      
      case MessageType.FILE:
        return (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl">{getMessageIcon()}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{message.fileName}</p>
              {message.fileSize && (
                <p className="text-xs text-gray-500">{formatFileSize(message.fileSize)}</p>
              )}
            </div>
            <button
              onClick={() => message.fileUrl && window.open(message.fileUrl, '_blank')}
              className="rounded bg-teal-600 px-3 py-1 text-xs font-medium text-white hover:bg-teal-700"
            >
              Download
            </button>
          </div>
        );
      
      default:
        return <p className="text-gray-900">{message.content}</p>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            <div className={`text-xs mb-1 opacity-75 ${isOwn ? 'text-teal-100' : 'text-gray-500'}`}>
              ↳ Replying to a message
            </div>
          )}

          {/* Message content */}
          {renderContent()}

          {/* Timestamp and status */}
          {showTimestamp && (
            <div className={`flex items-center justify-between mt-1 text-xs ${
              isOwn ? 'text-teal-100' : 'text-gray-500'
            }`}>
              <span>{formatTime(message.createdAt)}</span>
              {isOwn && (
                <span className={getStatusColor()}>
                  {getStatusIcon()}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          {showActions && !isEditing && (
            <div className={`absolute top-2 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} flex flex-col gap-1 p-1 bg-white border rounded-lg shadow-lg`}>
              <button
                onClick={() => onReply?.(message.id)}
                className="p-1 hover:bg-gray-100 rounded text-gray-600"
                title="Reply"
              >
                ↩️
              </button>
              
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600"
                  title="Edit"
                >
                  ✏️
                </button>
              )}
              
              {canDelete && (
                <button
                  onClick={() => onDelete?.(message.id)}
                  className="p-1 hover:bg-gray-100 rounded text-red-600"
                  title="Delete"
                >
                  🗑️
                </button>
              )}
              
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 hover:bg-gray-100 rounded text-gray-600"
                title="Add reaction"
              >
                😊
              </button>
            </div>
          )}

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div className={`absolute bottom-full mb-2 ${isOwn ? 'right-0' : 'left-0'} bg-white border rounded-lg shadow-lg p-2`}>
              <div className="grid grid-cols-5 gap-1">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReact?.(message.id, emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="p-1 hover:bg-gray-100 rounded text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {message.reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => onReact?.(message.id, reaction.emoji)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  isOwn 
                    ? 'bg-teal-100 text-teal-800 hover:bg-teal-200' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
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
