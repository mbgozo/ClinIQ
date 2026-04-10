"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

interface NotificationBellProps {
  onNotificationClick?: (notification: Notification) => void;
  className?: string;
}

export function NotificationBell({ onNotificationClick, className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: unreadData, isLoading } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return { count: 3 };
    },
    refetchInterval: 30000,
  });

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return [
        {
          id: '1',
          type: 'ANSWER_POSTED',
          title: 'New answer on your question',
          body: 'John Doe answered: "How to properly take blood pressure?"',
          read: false,
          link: '/questions/123#answer-456',
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        {
          id: '2',
          type: 'ANSWER_ACCEPTED',
          title: 'Your answer was accepted',
          body: 'Your answer to "Medication administration guidelines" was marked as accepted.',
          read: false,
          link: '/questions/789',
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
        {
          id: '3',
          type: 'BADGE_EARNED',
          title: 'You earned the Helpful badge',
          body: 'Your answers have received 5+ upvotes from the community.',
          read: true,
          link: '/profile',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
      ];
    },
    enabled: isOpen,
  });

  const unreadCount = unreadData?.count || 0;
  const notifications = notificationsData || [];

  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick?.(notification);
    setIsOpen(false);
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Notifications"
      >
        {/* Bell SVG icon */}
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          {/* Panel */}
          <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-white shadow-lg z-20">
            <div className="border-b px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-b px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-teal-50/60' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      {!notification.read && (
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-teal-600 flex-shrink-0" />
                      )}
                      <div className={`flex-1 min-w-0 ${notification.read ? 'pl-5' : ''}`}>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">
                          {notification.body}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t px-4 py-2">
              <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
