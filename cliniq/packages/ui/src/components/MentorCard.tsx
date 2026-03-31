// Generic user icon for avatar fallback
const UserIcon = () => (
  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const StarIcon = () => (
  <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CheckBadgeIcon = () => (
  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const TagIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 9V4a1 1 0 011-1z" />
  </svg>
);

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

  const formatExpertiseLabel = (area: string) =>
    area.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {mentor.user.avatarUrl ? (
              <img 
                src={mentor.user.avatarUrl} 
                alt={mentor.user.name} 
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <UserIcon />
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{mentor.user.name}</h3>
              {isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  <CheckBadgeIcon />
                  Verified
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
            <StarIcon />
            <span className="font-medium text-sm">{mentor.mentorRating.toFixed(1)}</span>
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
              <TagIcon />
              {formatExpertiseLabel(area)}
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
