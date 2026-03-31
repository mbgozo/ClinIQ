import { useState } from "react";

// SVG icon helpers
const UserIcon = () => (
  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PinIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
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

const FlagIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 2H21l-3 6 3 6H10.5l-1-2H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
);

const ReplyIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
);

const ShareIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const ThumbUpIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
  </svg>
);

const ExclamationIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
  </svg>
);

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
      className={`bg-white border rounded-lg p-4 ${post.pinned ? "border-teal-200 bg-teal-50/50" : "border-gray-200"} ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {post.user.avatarUrl ? (
              <img
                src={post.user.avatarUrl}
                alt={post.user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <UserIcon />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-gray-900">{post.user.name}</h4>
              {post.pinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
                  <PinIcon />
                  Pinned
                </span>
              )}
              {post.isFlagged && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                  <ExclamationIcon />
                  Flagged
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {post.user.institution} · {formatDate(post.createdAt)}
              {post.updatedAt !== post.createdAt && " · edited"}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 ml-2">
          {canPin && (
            <button
              onClick={() => (post.pinned ? onUnpin?.(post.id) : onPin?.(post.id))}
              className="p-1.5 text-gray-400 hover:text-teal-600 transition-colors rounded"
              title={post.pinned ? "Unpin post" : "Pin post"}
            >
              <PinIcon />
            </button>
          )}

          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded"
              title="Edit post"
            >
              <EditIcon />
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => onDelete?.(post.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded"
              title="Delete post"
            >
              <TrashIcon />
            </button>
          )}

          {onFlag && (
            <button
              onClick={() => onFlag?.(post.id)}
              className="p-1.5 text-gray-400 hover:text-orange-600 transition-colors rounded"
              title="Flag post"
            >
              <FlagIcon />
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
          <button className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
            <ReplyIcon />
            Reply
          </button>
          <button className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
            <ThumbUpIcon />
            Like
          </button>
          <button className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
            <ShareIcon />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
