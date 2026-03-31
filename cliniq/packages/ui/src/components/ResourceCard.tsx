// SVG Icon helpers
const UserIcon = () => (
  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const PresentationIcon = () => (
  <svg className="h-8 w-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const VideoIcon = () => (
  <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.806v6.388a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ImageIcon = () => (
  <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const AudioIcon = () => (
  <svg className="h-8 w-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
);

const LinkIcon = () => (
  <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const BookIcon = () => (
  <svg className="h-8 w-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const ExclamationIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
  </svg>
);

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    description?: string;
    url?: string;
    fileRef?: string;
    fileType?: string;
    course?: string;
    year?: number;
    downloads: number;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    user: {
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
    isFlagged?: boolean;
  };
  onDownload?: (resourceId: string) => void;
  onFlag?: (resourceId: string) => void;
  onEdit?: (resourceId: string) => void;
  onDelete?: (resourceId: string) => void;
  showActions?: boolean;
  className?: string;
}

export function ResourceCard({ 
  resource, 
  onDownload, 
  onFlag, 
  onEdit, 
  onDelete, 
  showActions = true,
  className = '' 
}: ResourceCardProps) {
  const getFileIcon = (fileType?: string) => {
    switch (fileType) {
      case 'PRESENTATION': return <PresentationIcon />;
      case 'VIDEO': return <VideoIcon />;
      case 'IMAGE': return <ImageIcon />;
      case 'AUDIO': return <AudioIcon />;
      case 'LINK': return <LinkIcon />;
      case 'STUDY_GUIDE':
      case 'CHEAT_SHEET':
      case 'CASE_STUDY':
      case 'RESEARCH_PAPER':
      case 'CLINICAL_GUIDELINE': return <BookIcon />;
      default: return <DocumentIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExternalLink = !!resource.url && !resource.fileRef;

  return (
    <div className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {isExternalLink ? <LinkIcon /> : getFileIcon(resource.fileType)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{resource.title}</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              {resource.category && (
                <span 
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                  style={{ 
                    backgroundColor: `${resource.category.color}20`,
                    color: resource.category.color
                  }}
                >
                  {resource.category.name}
                </span>
              )}
              {resource.course && (
                <span className="text-gray-500">{resource.course}</span>
              )}
              {resource.year && (
                <span className="text-gray-500">Year {resource.year}</span>
              )}
            </div>
          </div>
        </div>

        {/* Flagged indicator */}
        {resource.isFlagged && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 flex-shrink-0">
            <ExclamationIcon />
            Flagged
          </span>
        )}
      </div>

      {/* Description */}
      {resource.description && (
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{resource.description}</p>
      )}

      {/* Tags */}
      {resource.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 5).map((tag) => (
              <span 
                key={tag}
                className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
              >
                #{tag}
              </span>
            ))}
            {resource.tags.length > 5 && (
              <span className="text-xs text-gray-500">+{resource.tags.length - 5} more</span>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <DownloadIcon />
            {resource.downloads} downloads
          </span>
          <span>Uploaded {formatDate(resource.createdAt)}</span>
        </div>
      </div>

      {/* User info */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {resource.user.avatarUrl ? (
            <img 
              src={resource.user.avatarUrl} 
              alt={resource.user.name} 
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <div className="font-medium text-gray-900">{resource.user.name}</div>
          <div className="text-gray-500">{resource.user.institution}</div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2">
          <button
            onClick={() => onDownload?.(resource.id)}
            className="flex-1 flex items-center justify-center gap-2 rounded bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
          >
            <DownloadIcon />
            {isExternalLink ? 'Visit Link' : 'Download'}
          </button>
          
          <div className="flex gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(resource.id)}
                className="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
            )}
            
            {onFlag && (
              <button
                onClick={() => onFlag(resource.id)}
                className="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Flag
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(resource.id)}
                className="rounded border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
