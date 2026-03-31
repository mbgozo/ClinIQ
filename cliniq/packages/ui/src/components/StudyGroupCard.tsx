// SVG icon helpers
const UserIcon = ({ size = 4 }: { size?: number }) => (
  <svg className={`h-${size} w-${size} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LockIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const MailIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CrownIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l4 9 3-6 3 6 4-9" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17h18v2H3z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ZapIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

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
    switch (privacy) {
      case 'PRIVATE': return <LockIcon />;
      case 'INVITE_ONLY': return <MailIcon />;
      default: return <GlobeIcon />;
    }
  };

  const getCadenceIcon = () => <CalendarIcon />;

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

  const formatCadenceLabel = (cadence: string) =>
    cadence.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const isFull = group.memberCount >= group.maxMembers;
  const canJoin = !group.userRole && !isFull;
  const isMember = !!group.userRole;

  const getRoleLabel = () => {
    switch (group.userRole) {
      case 'OWNER': return { icon: <CrownIcon />, label: 'Owner' };
      case 'ADMIN': return { icon: <ZapIcon />, label: 'Admin' };
      case 'MODERATOR': return { icon: <ShieldIcon />, label: 'Moderator' };
      default: return { icon: <UserIcon size={3} />, label: 'Member' };
    }
  };

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
                {group.category.name}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
            <span className="flex items-center gap-1">
              {getPrivacyIcon(group.privacy)}
              {group.privacy.replace(/_/g, ' ')}
            </span>
            <span className="flex items-center gap-1">
              {getCadenceIcon()}
              {formatCadenceLabel(group.cadence)}
            </span>
            {group.institution && (
              <span>{group.institution}</span>
            )}
          </div>
        </div>

        {/* Member count */}
        <div className="text-right ml-4">
          <div className="text-2xl font-bold text-gray-900">{group.memberCount}</div>
          <div className="text-xs text-gray-500">
            {isFull ? 'Full' : `${group.maxMembers - group.memberCount} spots left`}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-2 text-sm">{group.description}</p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <span className="flex items-center gap-1.5">
          <UsersIcon />
          {group.memberCount} members
        </span>
        <span className="flex items-center gap-1.5">
          <ChatIcon />
          {group.postCount} posts
        </span>
        <span className="flex items-center gap-1.5">
          <ClockIcon />
          Active {formatDate(group.lastActivity)}
        </span>
      </div>

      {/* Owner info */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {group.owner.avatarUrl ? (
            <img 
              src={group.owner.avatarUrl} 
              alt={group.owner.name} 
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <UserIcon size={3} />
          )}
        </div>
        <div>
          <div className="font-medium text-gray-900">{group.owner.name}</div>
          <div className="text-gray-500">Owner · {group.owner.institution}</div>
        </div>
      </div>

      {/* User role indicator */}
      {group.userRole && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium bg-teal-100 text-teal-800">
            {(() => { const r = getRoleLabel(); return <>{r.icon} {r.label}</>; })()}
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
