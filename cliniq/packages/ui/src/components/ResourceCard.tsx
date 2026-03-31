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
    const iconMap: Record<string, string> = {
      'DOCUMENT': '📄',
      'PRESENTATION': '📊',
      'VIDEO': '🎥',
      'IMAGE': '🖼️',
      'AUDIO': '🎵',
      'LINK': '🔗',
      'STUDY_GUIDE': '📚',
      'CHEAT_SHEET': '📋',
      'CASE_STUDY': '🔍',
      'RESEARCH_PAPER': '📖',
      'CLINICAL_GUIDELINE': '🏥',
    };
    return iconMap[fileType || 'DOCUMENT'] || '📄';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isExternalLink = !!resource.url && !resource.fileRef;

  return (
    <div className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {isExternalLink ? '🔗' : getFileIcon(resource.fileType)}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{resource.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {resource.category && (
                <span 
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                  style={{ 
                    backgroundColor: `${resource.category.color}20`,
                    color: resource.category.color
                  }}
                >
                  {resource.category.icon} {resource.category.name}
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

        {/* Status indicators */}
        <div className="flex items-center gap-2">
          {resource.isFlagged && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
              ⚠️ Flagged
            </span>
          )}
        </div>
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
            <span>⬇️</span>
            {resource.downloads} downloads
          </span>
          <span>Uploaded {formatDate(resource.createdAt)}</span>
        </div>
      </div>

      {/* User info */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
          {resource.user.avatarUrl ? (
            <img 
              src={resource.user.avatarUrl} 
              alt={resource.user.name} 
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <span className="text-xs">👤</span>
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
            className="flex-1 rounded bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
          >
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
