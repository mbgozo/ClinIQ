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
  Check, 
  Eye, 
  Clock,
  Trash2,
  Inbox,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  RefreshCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";

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
        return <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 shadow-sm transition-transform group-hover:scale-110 duration-500"><MessageSquare className="h-6 w-6" /></div>;
      case 'ANSWER_ACCEPTED':
        return <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-600 shadow-sm transition-transform group-hover:scale-110 duration-500"><CheckCircle2 className="h-6 w-6" /></div>;
      case 'BADGE_EARNED':
        return <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-600 shadow-sm transition-transform group-hover:scale-110 duration-500"><Award className="h-6 w-6" /></div>;
      case 'QUESTION_UPVOTED':
        return <div className="h-14 w-14 rounded-2xl bg-teal-50 border border-teal-100/50 flex items-center justify-center text-teal-600 shadow-sm transition-transform group-hover:scale-110 duration-500"><ThumbsUp className="h-6 w-6" /></div>;
      case 'MENTOR_REQUEST':
        return <div className="h-14 w-14 rounded-2xl bg-violet-50 border border-violet-100/50 flex items-center justify-center text-violet-600 shadow-sm transition-transform group-hover:scale-110 duration-500"><UserPlus className="h-6 w-6" /></div>;
      default:
        return <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-600 shadow-sm transition-transform group-hover:scale-110 duration-500"><Bell className="h-6 w-6" /></div>;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'ANSWER_POSTED': return 'bg-indigo-500 shadow-indigo-500/50';
      case 'ANSWER_ACCEPTED': return 'bg-emerald-500 shadow-emerald-500/50';
      case 'BADGE_EARNED': return 'bg-amber-500 shadow-amber-500/50';
      case 'QUESTION_UPVOTED': return 'bg-teal-500 shadow-teal-500/50';
      case 'MENTOR_REQUEST': return 'bg-violet-500 shadow-violet-500/50';
      default: return 'bg-slate-400 shadow-slate-400/50';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-32 relative">
       {/* Ambient Tactical Flow */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10 blur-[100px]" />

      {/* Header Section: "Command Archive" */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-slate-100 shadow-sm w-fit"
          >
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Telemetry Intelligence Flow</span>
          </motion.div>
          <div className="space-y-4">
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 heading leading-none"
             >
                Telemetry Stream
             </motion.h1>
             <p className="text-slate-500 max-w-xl text-xl font-medium leading-tight opacity-80">
                Monitor community endorsements, clinical insights, and strategic distinctions as they manifest across the neural network.
             </p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 rounded-[2.5rem] px-8 py-6 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex items-center gap-8 relative overflow-hidden group"
        >
           <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
           <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center relative z-10 transition-transform group-hover:rotate-12">
              <Bell className="h-8 w-8 text-emerald-400" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 rounded-full border-4 border-slate-900 animate-pulse" />}
           </div>
           <div className="relative z-10">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Unprocessed Intel</p>
              <div className="flex items-baseline gap-2">
                 <p className="text-4xl font-black heading leading-none">{unreadCount}</p>
                 <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Active Bullets</span>
              </div>
           </div>
        </motion.div>
      </section>

      {/* Feed Instrumentation (Controller) */}
      <section className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="glass rounded-[2.5rem] p-4 lg:p-6 border-white/60 shadow-2xl relative overflow-hidden bg-white/40 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex bg-slate-100/50 p-2 rounded-[1.75rem] border border-slate-100">
             <button
               onClick={() => setFilter("all")}
               className={cn(
                 "px-10 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500",
                 filter === "all" ? "bg-white text-slate-900 shadow-xl border border-slate-100" : "text-slate-400 hover:text-slate-600"
               )}
             >
               Universal Archive
             </button>
             <button
               onClick={() => setFilter("unread")}
               className={cn(
                 "px-10 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 gap-3 flex items-center relative overflow-hidden",
                 filter === "unread" ? "bg-white text-slate-900 shadow-xl border border-slate-100" : "text-slate-400 hover:text-slate-600"
               )}
             >
               Live Briefings
               {unreadCount > 0 && <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />}
             </button>
          </div>

          <div className="flex items-center gap-4">
             {unreadCount > 0 && (
               <button
                 onClick={() => markAllAsReadMutation.mutate()}
                 disabled={markAllAsReadMutation.isPending}
                 className="group flex items-center gap-3 px-8 py-3 bg-white border border-slate-100 text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 shadow-sm active:scale-95 disabled:opacity-50"
               >
                 {markAllAsReadMutation.isPending ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />}
                 Acknowledge All Intel
               </button>
             )}
          </div>
        </div>
      </section>

      {/* Intelligence Flow Registry */}
      <section className="space-y-6 relative">
        <div className="absolute left-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-slate-100 via-slate-100 to-transparent flex flex-col items-center">
           <div className="h-4 w-4 rounded-full bg-slate-50 border border-slate-100 -mt-2 shadow-sm" />
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          {query.isLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 gap-6">
               <div className="h-16 w-16 border-4 border-emerald-100 border-t-emerald-600 rounded-[2rem] animate-spin shadow-2xl shadow-emerald-500/10" />
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Syncing Tactical Node...</p>
            </motion.div>
          ) : query.isError ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-32 bg-rose-50/50 rounded-[3rem] border border-rose-100 text-center px-12 glass">
               <AlertCircle className="h-16 w-16 text-rose-500 mb-6 animate-bounce" />
               <h3 className="text-2xl font-black text-slate-900 mb-3 heading uppercase tracking-tight">Signal Loss Detected</h3>
               <p className="text-slate-500 text-base font-medium max-w-md mx-auto">Failed to establish a secure link with the central telemetry node. Protocol manual reset required.</p>
               <button onClick={() => queryClient.invalidateQueries({ queryKey: ["notifications"] })} className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-rose-600 transition-all active:scale-95 shadow-xl shadow-rose-500/10">
                  RE-ESTABLISH LINK
               </button>
            </motion.div>
          ) : notifications.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 glass rounded-[3.5rem] border-white/60 text-center px-12 bg-white/40 backdrop-blur-xl relative">
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                  <Inbox className="h-48 w-48" />
               </div>
               <div className="h-24 w-24 rounded-[2.5rem] bg-white shadow-2xl border border-slate-50 flex items-center justify-center mb-10 group cursor-default">
                  <Inbox className="h-12 w-12 text-slate-200 group-hover:text-emerald-500 transition-color duration-700" />
               </div>
               <h3 className="text-3xl font-black text-slate-900 mb-4 heading uppercase tracking-tighter">Telemetry Clean</h3>
               <p className="text-slate-500 text-lg font-medium max-w-sm mx-auto opacity-70">No new operational updates manifest at this time. Your profile is in optimal sync status.</p>
            </motion.div>
          ) : (
            notifications.map((notification, i) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "glass group rounded-[2.5rem] p-8 border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 relative overflow-hidden flex items-start gap-10",
                  !notification.read ? "bg-white/95 ring-1 ring-emerald-500/10" : "bg-white/40 opacity-70 hover:opacity-100"
                )}
              >
                {!notification.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-b from-emerald-400 to-indigo-600 rounded-r-2xl" />
                )}

                <div className="relative">
                   {getNotificationIcon(notification.type)}
                   <div className={cn(
                     "absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full border-4 border-white shadow-lg animate-pulse",
                     getStatusColor(notification.type)
                   )} />
                </div>
                
                <div className="flex-1 min-w-0 space-y-3 pt-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div className="flex items-center gap-3">
                        <h3 className={cn("text-xl font-black heading tracking-tight uppercase leading-none", !notification.read ? "text-slate-900" : "text-slate-500")}>
                          {notification.title}
                        </h3>
                        {!notification.read && <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[9px] font-black text-emerald-600 uppercase tracking-widest">Priority Intel</span>}
                     </div>
                     <span className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap bg-slate-50 px-3 py-1 rounded-xl">
                        <Clock className="h-3.5 w-3.5" /> RECEIVED {formatTimeAgo(notification.createdAt)}
                     </span>
                  </div>
                  
                  <p className={cn("text-[15px] font-medium leading-relaxed max-w-3xl", !notification.read ? "text-slate-600" : "text-slate-400 opacity-60")}>
                    {notification.body}
                  </p>

                  <div className="flex items-center gap-6 pt-4">
                     {notification.link && (
                       <Link
                         href={notification.link}
                         className="flex items-center gap-3 text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] group/link"
                       >
                         <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center group-hover/link:bg-indigo-600 group-hover/link:text-white transition-all duration-500">
                            <ChevronRight className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform" />
                         </div>
                         <span className="group-hover/link:translate-x-1 transition-transform">Executive Sync Overview</span>
                       </Link>
                     )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  {!notification.read ? (
                    <button
                      onClick={() => markAsReadMutation.mutate(notification.id)}
                      disabled={markAsReadMutation.isPending}
                      className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-90 border border-emerald-100/50"
                      title="Mark as Processed"
                    >
                      <Check className="h-6 w-6" />
                    </button>
                  ) : (
                    <button
                      className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90 border border-slate-100"
                      title="Remove Record"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </section>

      {/* Legacy Retrieval Node */}
      {query.hasNextPage && (
        <div className="mt-20 text-center relative">
          <div className="absolute inset-0 flex items-center pointer-events-none">
             <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
            className="relative px-12 py-5 bg-white border border-slate-100 rounded-[2rem] text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all shadow-xl flex items-center gap-4 mx-auto disabled:opacity-50 group/more"
          >
            {query.isFetchingNextPage ? (
              <RefreshCcw className="h-5 w-5 animate-spin text-emerald-500" />
            ) : (
              <Eye className="h-5 w-5 group-hover:text-emerald-400 transition-colors" />
            )}
            {query.isFetchingNextPage ? 'RECOVERING ARCHIVES...' : 'RETRIEVE LEGACY INTELLIGENCE'}
          </motion.button>
        </div>
      )}
    </div>
  );
}
