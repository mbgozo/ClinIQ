"use client";

import { useState } from 'react';
import type { ModerationQueue } from '@cliniq/shared-types';
import { 
  ModerationAction, 
  ContentType,
  MODERATION_ACTION_DEFINITIONS,
  REPORT_REASON_DEFINITIONS,
} from '@cliniq/shared-types';

// SVG icon helpers
const CheckCircleIcon = () => (
  <svg className="h-14 w-14 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ContentTypeIconComponent = ({ contentType }: { contentType: ContentType }) => {
  switch (contentType) {
    case ContentType.QUESTION:
      return (
        <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case ContentType.ANSWER:
      return (
        <svg className="h-6 w-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case ContentType.RESOURCE:
      return (
        <svg className="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      );
    case ContentType.STUDY_GROUP:
    case ContentType.GROUP_POST:
      return (
        <svg className="h-6 w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case ContentType.USER_PROFILE:
      return (
        <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    default:
      return (
        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
  }
};

const UserIcon = () => (
  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

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
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_REVIEW: 'bg-blue-100 text-blue-800',
      RESOLVED: 'bg-green-100 text-green-800',
      DISMISSED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.PENDING;
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
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircleIcon />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear</h3>
          <p className="text-gray-500">The moderation queue is empty.</p>
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
                  <ContentTypeIconComponent contentType={item.contentType} />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.contentType.replace(/_/g, ' ')} — <span className="font-mono text-sm text-gray-600">{item.contentId}</span>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
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
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: (REPORT_REASON_DEFINITIONS[item.reason]?.color || '#6B7280') + '20',
                        color: REPORT_REASON_DEFINITIONS[item.reason]?.color || '#6B7280'
                      }}
                    >
                      {REPORT_REASON_DEFINITIONS[item.reason]?.name || item.reason}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>

                {/* Reporter Info */}
                <div className="flex items-center gap-2 mb-3">
                  {item.reporter.avatarUrl ? (
                    <img src={item.reporter.avatarUrl} alt={item.reporter.name}
                         className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <UserIcon />
                    </div>
                  )}
                  <span className="text-sm text-gray-600">Reported by {item.reporter.name}</span>
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
                      <span className="text-sm font-medium text-green-800">
                        Resolved by {item.moderator.name}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: getActionColor(item.action) + '20',
                          color: getActionColor(item.action)
                        }}
                      >
                        {MODERATION_ACTION_DEFINITIONS[item.action]?.name}
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
                      className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition-colors"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => onDismiss(item.id)}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium transition-colors"
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
              <h3 className="font-medium text-gray-900 mb-2">Content Preview</h3>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm text-gray-700">
                  {truncateText(typeof selectedItem.content === 'string' ? selectedItem.content : JSON.stringify(selectedItem.content), 200)}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Report Reason</h3>
              <span
                className="inline-flex items-center px-2 py-1 rounded text-sm font-medium"
                style={{
                  backgroundColor: (REPORT_REASON_DEFINITIONS[selectedItem.reason]?.color || '#6B7280') + '20',
                  color: REPORT_REASON_DEFINITIONS[selectedItem.reason]?.color || '#6B7280'
                }}
              >
                {REPORT_REASON_DEFINITIONS[selectedItem.reason]?.name || selectedItem.reason}
              </span>
              <p className="text-sm text-gray-600 mt-2">{selectedItem.description}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value as ModerationAction)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                Reason <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Provide a reason for this action..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmResolution}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition-colors"
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
