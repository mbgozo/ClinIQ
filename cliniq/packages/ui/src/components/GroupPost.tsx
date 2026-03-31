import { useState } from "react";

interface GroupPostProps {
  post: {
    id: string;
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
  };
  onEdit?: (postId: string, content: string) => void;
  onDelete?: (postId: string) => void;
  onPin?: (postId: string) => void;
  onUnpin?: (postId: string) => void;
  onFlag?: (postId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canPin?: boolean;
  className?: string;
}

export function GroupPost({
  post,
  onEdit,
  onDelete,
  onPin,
  onUnpin,
  onFlag,
  canEdit = false,
  canDelete = false,
  canPin = false,
  className = "",
}: GroupPostProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.body);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== post.body) {
      onEdit?.(post.id, editContent);
    }
    setIsEditing(false);
    setEditContent(post.body);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.body);
  };

  return (
    <div
      className={`bg-white border rounded-lg p-4 ${post.pinned ? "border-teal-200 bg-teal-50" : ""} ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            {post.user.avatarUrl ? (
              <img
                src={post.user.avatarUrl}
                alt={post.user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm">👤</span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{post.user.name}</h4>
              {post.pinned && (
                <span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
                  📌 Pinned
                </span>
              )}
              {post.isFlagged && (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                  ⚠️ Flagged
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {post.user.institution} • {formatDate(post.createdAt)}
              {post.updatedAt !== post.createdAt && " • edited"}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {canPin && (
            <button
              onClick={() => (post.pinned ? onUnpin?.(post.id) : onPin?.(post.id))}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title={post.pinned ? "Unpin post" : "Pin post"}
            >
              📌
            </button>
          )}

          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Edit post"
            >
              ✏️
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => onDelete?.(post.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete post"
            >
              🗑️
            </button>
          )}

          {onFlag && (
            <button
              onClick={() => onFlag?.(post.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Flag post"
            >
              🚩
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        {isEditing ? (
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
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap break-words">{post.body}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div>
          {post.updatedAt !== post.createdAt && (
            <span>Last edited {formatDate(post.updatedAt)}</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button className="hover:text-gray-700 transition-colors">💬 Reply</button>
          <button className="hover:text-gray-700 transition-colors">👍 Like</button>
          <button className="hover:text-gray-700 transition-colors">📤 Share</button>
        </div>
      </div>
    </div>
  );
}
