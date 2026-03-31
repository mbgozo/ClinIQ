interface StudyGroupCardProps {
  group: {
    id: string;
    name: string;
    description: string;
    categoryId?: string;
    institution?: string;
    privacy: string;
    cadence: string;
    maxMembers: number;
    memberCount: number;
    postCount: number;
    lastActivity: string;
    createdAt: string;
    updatedAt: string;
    owner: {
      id: string;
      name: string;
      avatarUrl?: string;
      institution: string;
    };
    category?: {
      id: string;
      name: string;
      icon: string;
      color: string;
    };
    userRole?: string;
    joinedAt?: string;
  };
  onJoin?: (groupId: string, inviteCode?: string) => void;
  onLeave?: (groupId: string) => void;
  onManage?: (groupId: string) => void;
  showActions?: boolean;
  className?: string;
}

export function StudyGroupCard({ 
  group, 
  onJoin, 
  onLeave, 
  onManage, 
  showActions = true,
  className = '' 
}: StudyGroupCardProps) {
  const getPrivacyIcon = (privacy: string) => {
    const iconMap: Record<string, string> = {
      'PUBLIC': '🌍',
      'PRIVATE': '🔒',
      'INVITE_ONLY': '📧',
    };
    return iconMap[privacy] || '🌍';
  };

  const getCadenceIcon = (cadence: string) => {
    const iconMap: Record<string, string> = {
      'DAILY': '📅',
      'WEEKLY': '📆',
      'BI_WEEKLY': '📋',
      'MONTHLY': '🗓️',
      'AS_NEEDED': '⏰',
    };
    return iconMap[cadence] || '📅';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'today';
    if (diffDays === 2) return 'yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const isFull = group.memberCount >= group.maxMembers;
  const canJoin = !group.userRole && !isFull;
  const isMember = !!group.userRole;

  return (
    <div className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-lg">{group.name}</h3>
            {group.category && (
              <span 
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                style={{ 
                  backgroundColor: `${group.category.color}20`,
                  color: group.category.color
                }}
              >
                {group.category.icon} {group.category.name}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
            <span className="flex items-center gap-1">
              {getPrivacyIcon(group.privacy)} {group.privacy}
            </span>
            <span className="flex items-center gap-1">
              {getCadenceIcon(group.cadence)} {group.cadence}
            </span>
            {group.institution && (
              <span>{group.institution}</span>
            )}
          </div>
        </div>

        {/* Member count */}
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{group.memberCount}</div>
          <div className="text-xs text-gray-500">
            {isFull ? 'Full' : `${group.maxMembers - group.memberCount} spots`}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-2">{group.description}</p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <span className="flex items-center gap-1">
          <span>👥</span>
          {group.memberCount} members
        </span>
        <span className="flex items-center gap-1">
          <span>💬</span>
          {group.postCount} posts
        </span>
        <span className="flex items-center gap-1">
          <span>🕒</span>
          Last active {formatDate(group.lastActivity)}
        </span>
      </div>

      {/* Owner info */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
          {group.owner.avatarUrl ? (
            <img 
              src={group.owner.avatarUrl} 
              alt={group.owner.name} 
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <span className="text-xs">👤</span>
          )}
        </div>
        <div>
          <div className="font-medium text-gray-900">{group.owner.name}</div>
          <div className="text-gray-500">Owner • {group.owner.institution}</div>
        </div>
      </div>

      {/* User role indicator */}
      {group.userRole && (
        <div className="mb-4">
          <span 
            className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-teal-100 text-teal-800"
          >
            {group.userRole === 'OWNER' && '👑 Owner'}
            {group.userRole === 'ADMIN' && '⚡ Admin'}
            {group.userRole === 'MODERATOR' && '🛡️ Moderator'}
            {group.userRole === 'MEMBER' && '👤 Member'}
          </span>
          {group.joinedAt && (
            <span className="text-xs text-gray-500 ml-2">
              Joined {formatDate(group.joinedAt)}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2">
          {canJoin && (
            <button
              onClick={() => onJoin?.(group.id)}
              className="flex-1 rounded bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
            >
              Join Group
            </button>
          )}
          
          {isMember && (
            <>
              <button
                onClick={() => onManage?.(group.id)}
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Group
              </button>
              
              {group.userRole !== 'OWNER' && (
                <button
                  onClick={() => onLeave?.(group.id)}
                  className="rounded border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                >
                  Leave
                </button>
              )}
            </>
          )}

          {!isMember && isFull && (
            <button
              disabled
              className="flex-1 rounded bg-gray-300 px-3 py-2 text-sm font-medium text-gray-500 cursor-not-allowed"
            >
              Group Full
            </button>
          )}
        </div>
      )}
    </div>
  );
}
