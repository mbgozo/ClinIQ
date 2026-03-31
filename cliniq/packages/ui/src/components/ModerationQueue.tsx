import { useState } from 'react';
import { 
  ModerationQueue, 
  ModerationAction, 
  ContentType, 
  ReportReason,
  MODERATION_ACTION_DEFINITIONS,
  REPORT_REASON_DEFINITIONS,
  getContentTypeIcon
} from '@cliniq/shared-types';

interface ModerationQueueProps {
  queue: ModerationQueue[];
  onResolve: (itemId: string, action: ModerationAction, reason?: string) => void;
  onDismiss: (itemId: string) => void;
  loading?: boolean;
  className?: string;
}

export function ModerationQueue({ 
  queue, 
  onResolve, 
  onDismiss, 
  loading = false,
  className = ''
}: ModerationQueueProps) {
  const [selectedItem, setSelectedItem] = useState<ModerationQueue | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ModerationAction>(ModerationAction.APPROVE);
  const [actionReason, setActionReason] = useState('');

  const handleResolve = (item: ModerationQueue) => {
    setSelectedItem(item);
    setSelectedAction(ModerationAction.APPROVE);
    setActionReason('');
    setShowDetailsModal(true);
  };

  const confirmResolution = () => {
    if (selectedItem) {
      onResolve(selectedItem.id, selectedAction, actionReason || undefined);
      setShowDetailsModal(false);
      setSelectedItem(null);
      setActionReason('');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_REVIEW: 'bg-blue-100 text-blue-800',
      RESOLVED: 'bg-green-100 text-green-800',
      DISMISSED: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  const getActionColor = (action: ModerationAction) => {
    return MODERATION_ACTION_DEFINITIONS[action]?.color || '#6B7280';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {queue.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
          <p className="text-gray-600">No items in the moderation queue.</p>
        </div>
      ) : (
        queue.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{getContentTypeIcon(item.contentType)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.contentType} - {item.contentId}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Reported {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Report Details */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Reason:</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs" 
                          style={{ backgroundColor: REPORT_REASON_DEFINITIONS[item.reason]?.color + '20', color: REPORT_REASON_DEFINITIONS[item.reason]?.color }}>
                      <span>{REPORT_REASON_DEFINITIONS[item.reason]?.icon}</span>
                      <span>{REPORT_REASON_DEFINITIONS[item.reason]?.name}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>

                {/* Reporter Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {item.reporter.avatarUrl ? (
                      <img src={item.reporter.avatarUrl} alt={item.reporter.name} 
                           className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xs">👤</span>
                      </div>
                    )}
                    <span className="text-sm text-gray-600">
                      Reported by {item.reporter.name}
                    </span>
                  </div>
                </div>

                {/* Content Preview */}
                {item.content && (
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <p className="text-sm text-gray-700">
                      {truncateText(typeof item.content === 'string' ? item.content : JSON.stringify(item.content))}
                    </p>
                  </div>
                )}

                {/* Resolution Info */}
                {item.status === 'RESOLVED' && item.action && item.moderator && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-green-800">Resolved by {item.moderator.name}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                            style={{ backgroundColor: getActionColor(item.action) + '20', color: getActionColor(item.action) }}>
                        <span>{MODERATION_ACTION_DEFINITIONS[item.action]?.icon}</span>
                        <span>{MODERATION_ACTION_DEFINITIONS[item.action]?.name}</span>
                      </span>
                    </div>
                    {item.actionReason && (
                      <p className="text-sm text-green-700">{item.actionReason}</p>
                    )}
                    <p className="text-xs text-green-600 mt-1">
                      {formatDate(item.resolvedAt || item.updatedAt)}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {item.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolve(item)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => onDismiss(item.id)}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Resolution Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Resolve Moderation Item</h2>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Content Details</h3>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm text-gray-700">
                  {truncateText(typeof selectedItem.content === 'string' ? selectedItem.content : JSON.stringify(selectedItem.content), 200)}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Report Reason</h3>
              <div className="flex items-center gap-2">
                <span>{REPORT_REASON_DEFINITIONS[selectedItem.reason]?.icon}</span>
                <span className="text-sm">{REPORT_REASON_DEFINITIONS[selectedItem.reason]?.name}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{selectedItem.description}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action
              </label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value as ModerationAction)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(ModerationAction).map((action) => (
                  <option key={action} value={action}>
                    {MODERATION_ACTION_DEFINITIONS[action]?.name || action}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Provide a reason for this action..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmResolution}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
