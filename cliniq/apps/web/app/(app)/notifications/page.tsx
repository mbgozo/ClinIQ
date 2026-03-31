"use client";

import { useState } from "react";
import Link from "next/link";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnsweredBadge } from "@cliniq/ui";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export default function NotificationCenterPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const queryClient = useQueryClient();

  // Mock infinite query - replace with actual API call
  const query = useInfiniteQuery({
    queryKey: ["notifications", filter],
    queryFn: async ({ pageParam = 1 }) => {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'ANSWER_POSTED',
          title: 'New answer on your question',
          body: 'John Doe answered: "How to properly take blood pressure? Check this step-by-step guide..."',
          read: false,
          link: '/questions/123#answer-456',
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        {
          id: '2',
          type: 'ANSWER_ACCEPTED',
          title: 'Your answer was accepted!',
          body: 'Your answer to "Medication administration guidelines" was marked as accepted.',
          read: false,
          link: '/questions/789',
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
        {
          id: '3',
          type: 'BADGE_EARNED',
          title: 'You earned the HELPFUL badge!',
          body: 'Your answers have received 5+ upvotes from the community.',
          read: true,
          link: '/profile',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
          id: '4',
          type: 'QUESTION_UPVOTED',
          title: 'Your question received an upvote',
          body: 'Your question "Best practices for wound care" was upvoted by the community.',
          read: true,
          link: '/questions/456',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        },
        {
          id: '5',
          type: 'MENTOR_REQUEST',
          title: 'New mentorship request',
          body: 'Jane Smith requested your guidance on pediatric nursing topics.',
          read: true,
          link: '/mentors/requests/789',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
      ];

      // Filter based on selected filter
      const filtered = filter === "unread" 
        ? mockNotifications.filter(n => !n.read)
        : mockNotifications;

      return {
        data: filtered,
        meta: { total: filtered.length, page: pageParam, hasMore: false }
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined,
  });

  // Mock mutations - replace with actual API calls
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { id: notificationId, read: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { updated: 3 };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    }
  });

  const notifications = query.data?.pages.flatMap(page => page.data) ?? [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ANSWER_POSTED':
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'ANSWER_ACCEPTED':
        return (
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'BADGE_EARNED':
        return (
          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        );
      case 'QUESTION_UPVOTED':
        return (
          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-gray-600">Stay updated with your latest activity</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              filter === "all"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 text-sm font-medium rounded-lg relative ${
              filter === "unread"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
            className="text-sm text-teal-600 hover:text-teal-700 disabled:opacity-50"
          >
            {markAllAsReadMutation.isPending ? 'Marking...' : 'Mark all as read'}
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {query.isLoading && (
          <div className="text-center py-8 text-gray-500">Loading notifications...</div>
        )}

        {query.isError && (
          <div className="text-center py-8 text-red-600">Failed to load notifications.</div>
        )}

        {!query.isLoading && !query.isError && notifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </div>
        )}

        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
              !notification.read ? "bg-teal-50 border-teal-200" : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            {getNotificationIcon(notification.type)}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.body}</p>
                  <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(notification.createdAt)}</p>
                </div>
                
                {!notification.read && (
                  <button
                    onClick={() => markAsReadMutation.mutate(notification.id)}
                    disabled={markAsReadMutation.isPending}
                    className="text-xs text-teal-600 hover:text-teal-700 disabled:opacity-50 flex-shrink-0"
                  >
                    Mark as read
                  </button>
                )}
              </div>
              
              {notification.link && (
                <Link
                  href={notification.link}
                  className="inline-block mt-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  View →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {query.hasNextPage && (
        <div className="mt-6 text-center">
          <button
            onClick={() => query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
            className="px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 disabled:opacity-50"
          >
            {query.isFetchingNextPage ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </main>
  );
}
