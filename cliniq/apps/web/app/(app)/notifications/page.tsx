"use client";

import { useState } from "react";
import Link from "next/link";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Bell, 
  MessageSquare, 
  CheckCircle2, 
  Award, 
  ThumbsUp, 
  UserPlus, 
  MoreHorizontal, 
  Check, 
  Eye, 
  Clock,
  Trash2,
  Inbox,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

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
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'ANSWER_POSTED',
          title: 'Intelligence Update',
          body: 'John Doe provided a clinical breakdown for your inquiry on arterial tension protocols...',
          read: false,
          link: '/questions/123#answer-456',
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        {
          id: '2',
          type: 'ANSWER_ACCEPTED',
          title: 'Honorary Recognition',
          body: 'Your clinical synthesis on "Vascular Access Management" was marked as the definitive solution.',
          read: false,
          link: '/questions/789',
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
        {
          id: '3',
          type: 'BADGE_EARNED',
          title: 'Distinction Acquired',
          body: 'You have been awarded the "Elite Responder" badge for exceptional community contributions.',
          read: true,
          link: '/profile',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
          id: '4',
          type: 'QUESTION_UPVOTED',
          title: 'Intel Verification',
          body: 'Your protocol query "Optimal Wound Debridement" received 10+ community endorsements.',
          read: true,
          link: '/questions/456',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        },
        {
          id: '5',
          type: 'MENTOR_REQUEST',
          title: 'Mentorship Proposal',
          body: 'Jane Smith requested your strategic guidance on Pediatric Intensive Care certifications.',
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

    if (diffMins < 1) return 'moment ago';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ANSWER_POSTED':
        return <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600"><MessageSquare className="h-5 w-5" /></div>;
      case 'ANSWER_ACCEPTED':
        return <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600"><CheckCircle2 className="h-5 w-5" /></div>;
      case 'BADGE_EARNED':
        return <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600"><Award className="h-5 w-5" /></div>;
      case 'QUESTION_UPVOTED':
        return <div className="h-10 w-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600"><ThumbsUp className="h-5 w-5" /></div>;
      case 'MENTOR_REQUEST':
        return <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600"><UserPlus className="h-5 w-5" /></div>;
      default:
        return <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600"><Bell className="h-5 w-5" /></div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 w-fit">
            <Sparkles className="h-3 w-3 text-indigo-600" />
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Real-time Updates</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 heading">Alert Directive</h1>
          <p className="text-slate-500 max-w-lg text-lg leading-relaxed">
            Monitor community endorsements, clinical insights, and strategic distinctions as they manifest.
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl px-6 py-4 text-white shadow-xl shadow-slate-200 flex items-center gap-4">
           <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-emerald-400" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unread Briefings</p>
              <p className="text-2xl font-bold heading leading-none">{unreadCount}</p>
           </div>
        </div>
      </section>

      {/* Controller Bar */}
      <section className="glass rounded-[2rem] p-4 border-white/40 shadow-xl flex items-center justify-between">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
           <button
             onClick={() => setFilter("all")}
             className={cn(
               "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
               filter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
             )}
           >
             Archive
           </button>
           <button
             onClick={() => setFilter("unread")}
             className={cn(
               "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all gap-2 flex items-center",
               filter === "unread" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
             )}
           >
             Unread
             {unreadCount > 0 && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
           </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
            className="flex items-center gap-2 px-5 py-2 hover:bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {markAllAsReadMutation.isPending ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Clear Intelligence
          </button>
        )}
      </section>

      {/* Notifications Registry */}
      <section className="space-y-4">
        <AnimatePresence mode="popLayout">
          {query.isLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-4">
               <div className="h-12 w-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Communication Hub...</p>
            </motion.div>
          ) : query.isError ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-[2.5rem] border border-red-100 text-center px-6">
               <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
               <h3 className="text-xl font-bold text-slate-900 mb-2 heading">System Link Lost</h3>
               <p className="text-slate-500 text-sm">Failed to establish a secure link with the notification node.</p>
            </motion.div>
          ) : notifications.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 glass rounded-[2.5rem] border-white/40 text-center px-6">
               <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6">
                  <Inbox className="h-10 w-10 text-slate-200" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-2 heading">Intelligence Clear</h3>
               <p className="text-slate-500 max-w-sm">No new operational updates. Your current status is up to date.</p>
            </motion.div>
          ) : (
            notifications.map((notification, i) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "glass group rounded-[2rem] p-6 border-white/40 transition-all duration-300 relative overflow-hidden flex items-center gap-6",
                  !notification.read ? "bg-white/90 shadow-xl border-emerald-100 ring-1 ring-emerald-500/5" : "bg-white/40 hover:bg-white/60"
                )}
              >
                {!notification.read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-emerald-500 rounded-r-lg" />}
                
                {getNotificationIcon(notification.type)}
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                     <h3 className={cn("text-base font-bold tracking-tight", !notification.read ? "text-slate-900" : "text-slate-500")}>
                       {notification.title}
                     </h3>
                     {!notification.read && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />}
                  </div>
                  <p className={cn("text-sm font-medium leading-relaxed line-clamp-2", !notification.read ? "text-slate-600" : "text-slate-400")}>
                    {notification.body}
                  </p>
                  <div className="flex items-center gap-4 pt-1">
                     <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Clock className="h-3 w-3" /> {formatTimeAgo(notification.createdAt)}
                     </span>
                     {notification.link && (
                       <Link
                         href={notification.link}
                         className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors"
                       >
                         Executive View <ChevronRight className="h-3 w-3" />
                       </Link>
                     )}
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.read ? (
                    <button
                      onClick={() => markAsReadMutation.mutate(notification.id)}
                      disabled={markAsReadMutation.isPending}
                      className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-all shadow-sm"
                      title="Mark as Processed"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                      title="Remove Record"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </section>

      {/* Footer System Status */}
      {query.hasNextPage && (
        <div className="mt-12 text-center">
          <button
            onClick={() => query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
            className="px-8 py-4 glass border-white/50 rounded-2xl text-[10px] font-bold text-slate-900 uppercase tracking-widest hover:bg-white transition-all shadow-sm flex items-center gap-3 mx-auto active:scale-95"
          >
            {query.isFetchingNextPage ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            Retrieve Legacy Intel
          </button>
        </div>
      )}
    </div>
  );
}
