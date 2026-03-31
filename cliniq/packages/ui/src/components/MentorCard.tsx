interface MentorCardProps {
  mentor: {
    id: string;
    user: {
      id: string;
      name: string;
      avatarUrl?: string;
      institution: string;
      program: string;
    };
    bio: string;
    expertiseAreas: string[];
    institution: string;
    currentRole: string;
    availability: string;
    languages: string[];
    verifiedAt?: string;
    mentorRating: number;
    mentorshipCount: number;
    acceptanceRate: number;
  };
  onRequestMentorship?: (mentorId: string) => void;
  className?: string;
}

export function MentorCard({ mentor, onRequestMentorship, className = '' }: MentorCardProps) {
  const isVerified = !!mentor.verifiedAt;
  const expertiseAreaIcons: Record<string, string> = {
    'MEDICAL_SURGICAL': '🏥',
    'PEDIATRICS': '👶',
    'OBSTETRICS_GYNECOLOGY': '🤱',
    'MENTAL_HEALTH': '🧠',
    'COMMUNITY_HEALTH': '🏘️',
    'CRITICAL_CARE': '🚑',
    'EMERGENCY_NURSING': '🆘',
    'GERIATRICS': '👴',
    'PHARMACOLOGY': '💊',
    'PATHOPHYSIOLOGY': '🔬',
    'NURSING_LEADERSHIP': '👔',
    'RESEARCH_METHODS': '📊',
    'HEALTH_ASSESSMENT': '🩺',
  };

  return (
    <div className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
            {mentor.user.avatarUrl ? (
              <img 
                src={mentor.user.avatarUrl} 
                alt={mentor.user.name} 
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg">👤</span>
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{mentor.user.name}</h3>
              {isVerified && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{mentor.currentRole}</p>
            <p className="text-xs text-gray-500">{mentor.user.institution}</p>
          </div>
        </div>
        
        {/* Rating */}
        <div className="text-right">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-medium">{mentor.mentorRating.toFixed(1)}</span>
          </div>
          <p className="text-xs text-gray-500">{mentor.mentorshipCount} mentorships</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-3">{mentor.bio}</p>

      {/* Expertise Areas */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Expertise Areas</h4>
        <div className="flex flex-wrap gap-1">
          {mentor.expertiseAreas.slice(0, 3).map((area) => (
            <span 
              key={area}
              className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800"
            >
              <span>{expertiseAreaIcons[area] || '📚'}</span>
              {area.replace('_', ' ')}
            </span>
          ))}
          {mentor.expertiseAreas.length > 3 && (
            <span className="text-xs text-gray-500">+{mentor.expertiseAreas.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="font-medium text-gray-900">{Math.round(mentor.acceptanceRate * 100)}%</span>
          <span className="text-gray-600 ml-1">acceptance rate</span>
        </div>
        <div>
          <span className="font-medium text-gray-900">{mentor.languages.length}</span>
          <span className="text-gray-600 ml-1">languages</span>
        </div>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-1">Available</h4>
        <p className="text-sm text-gray-600">{mentor.availability}</p>
      </div>

      {/* Languages */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-1">Languages</h4>
        <div className="flex flex-wrap gap-1">
          {mentor.languages.map((lang) => (
            <span 
              key={lang}
              className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      {onRequestMentorship && (
        <button
          onClick={() => onRequestMentorship(mentor.id)}
          disabled={!isVerified}
          className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            isVerified
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isVerified ? 'Request Mentorship' : 'Not Available'}
        </button>
      )}
    </div>
  );
}
