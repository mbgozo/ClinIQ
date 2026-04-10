"use client";

import * as Icons from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

interface StudyGroupCardProps {
  group: {
    id: string;
    name: string;
    description: string;
    categoryId?: string;
    institution?: string;
    privacy: string;
    cadence: string;
    maxMembers: number;
    memberCount: number;
    postCount: number;
    lastActivity: string;
    createdAt: string;
    updatedAt: string;
    owner: {
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
    userRole?: string;
    joinedAt?: string;
  };
  onJoin?: (groupId: string, inviteCode?: string) => void;
  onLeave?: (groupId: string) => void;
  onManage?: (groupId: string) => void;
  showActions?: boolean;
  className?: string;
}

export function StudyGroupCard({ 
  group, 
  onJoin, 
  onLeave, 
  onManage, 
  showActions = true,
  className = '' 
}: StudyGroupCardProps) {
  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'PRIVATE': return <Icons.Lock className="h-4 w-4" />;
      case 'INVITE_ONLY': return <Icons.Mail className="h-4 w-4" />;
      default: return <Icons.Globe className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Active Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays}d Pulse`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)}w Shift`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatCadenceLabel = (cadence: string) => cadence.replace(/_/g, ' ').toLowerCase();

  const isFull = group.memberCount >= group.maxMembers;
  const canJoin = !group.userRole && !isFull;
  const isMember = !!group.userRole;

  const getRoleLabel = () => {
    switch (group.userRole) {
      case 'OWNER': return { icon: <Icons.Crown className="h-4 w-4 text-emerald-500" />, label: 'Lead Architect', color: 'text-emerald-600' };
      case 'ADMIN': return { icon: <Icons.Zap className="h-4 w-4 text-indigo-500" />, label: 'Core Admin', color: 'text-indigo-600' };
      case 'MODERATOR': return { icon: <Icons.ShieldCheck className="h-4 w-4 text-amber-500" />, label: 'Validator', color: 'text-amber-600' };
      default: return { icon: <Icons.User className="h-4 w-4 text-slate-500" />, label: 'Fellow', color: 'text-slate-600' };
    }
  };

  const capacityPercentage = (group.memberCount / group.maxMembers) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "glass group border-white hover:border-emerald-300/30 transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_50px_100px_-20px_rgba(16,185,129,0.15)] rounded-[3.5rem] overflow-hidden flex flex-col relative bg-white/40 backdrop-blur-3xl",
        className
      )}
    >
      {/* Dynamic Activity Beacon */}
      <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-1000" />
      
      <div className="p-12 flex-1 flex flex-col relative z-10">
        {/* Superior Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-4">
             <div className="flex flex-wrap items-center gap-4">
               <h3 className="text-3xl font-black text-slate-900 heading group-hover:text-emerald-800 transition-colors leading-[1.1] tracking-tight">{group.name}</h3>
               {group.category && (
                 <span className="px-4 py-1.5 bg-emerald-50 border border-emerald-100/50 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">
                   {group.category.name}
                 </span>
               )}
             </div>
             <div className="flex flex-wrap items-center gap-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-2.5 px-3 py-1 rounded-xl hover:bg-slate-50 transition-all">
                  {getPrivacyIcon(group.privacy)} {group.privacy.replace(/_/g, ' ')}
                </span>
                <span className="flex items-center gap-2.5 px-3 py-1 rounded-xl hover:bg-slate-50 transition-all">
                  <Icons.Activity className="h-4 w-4 text-emerald-500 animate-pulse" /> {formatCadenceLabel(group.cadence)}
                </span>
             </div>
          </div>

          <div className="h-14 w-14 rounded-2xl glass border-white flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white cursor-pointer transition-all active:scale-90 shadow-sm">
             <Icons.MoreVertical className="h-6 w-6" />
          </div>
        </div>

        {/* Narrative Core */}
        <p className="text-[15px] text-slate-500 mb-10 line-clamp-2 font-medium leading-relaxed opacity-80">
          {group.description}
        </p>

        {/* Capacity Matrix & Intel Nodes */}
        <div className="space-y-10 mb-10 pb-10 border-b border-slate-100/50">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Operational Cohort</p>
                 <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-12 w-12 rounded-[1.25rem] border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-2xl ring-2 ring-slate-50/50 relative group/icon transition-transform hover:scale-110 hover:z-20">
                         <Icons.User className="h-6 w-6 text-slate-300 group-hover/icon:text-emerald-500 transition-colors" />
                      </div>
                    ))}
                    <div className="h-12 w-12 rounded-[1.25rem] border-4 border-white bg-slate-950 flex items-center justify-center text-[10px] font-black text-white shadow-2xl ring-2 ring-slate-50 relative z-10 hover:scale-110 transition-transform">
                       +{group.memberCount}
                    </div>
                 </div>
              </div>
              
              <div className="text-left md:text-right space-y-4 flex-1 max-w-[220px]">
                 <div className="flex items-center justify-between md:justify-end gap-3 text-[11px] font-black text-slate-900 uppercase tracking-widest">
                   {isFull ? <span className="text-rose-600">Saturation Limit</span> : <span>{group.maxMembers - group.memberCount} Nodes Remaining</span>}
                   <Icons.Fingerprint className={cn("h-4 w-4", isFull ? "text-rose-500" : "text-emerald-500")} />
                 </div>
                 <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${capacityPercentage}%` }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        "h-full rounded-full transition-all duration-700 relative",
                        isFull ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]" : "bg-gradient-to-r from-emerald-400 via-emerald-500 to-indigo-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      )} 
                    >
                       <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                 </div>
              </div>
           </div>
        </div>

        {/* Intel Metrics Grid */}
        <div className="grid grid-cols-3 gap-8 mb-12">
           <div className="space-y-3 group/metric">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2.5 group-hover/metric:text-emerald-600 transition-colors">
                 <Icons.MessageSquare className="h-4 w-4" /> Intel Hub
              </p>
              <p className="text-xl font-black text-slate-900 heading tracking-tight leading-none uppercase">{group.postCount} Reports</p>
           </div>
           <div className="space-y-3 group/metric">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2.5 group-hover/metric:text-indigo-600 transition-colors">
                 <Icons.Clock className="h-4 w-4" /> Sync Pulse
              </p>
              <p className="text-xl font-black text-slate-900 heading tracking-tight leading-none uppercase">{formatDate(group.lastActivity)}</p>
           </div>
           <div className="space-y-3 group/metric">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2.5 group-hover/metric:text-amber-600 transition-colors">
                 <Icons.Fingerprint className="h-4 w-4" /> Authority
              </p>
              {group.userRole ? (
                <div className={cn("flex items-center gap-2 text-[12px] font-black uppercase tracking-tight", getRoleLabel().color)}>
                   {getRoleLabel().icon} {getRoleLabel().label}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[12px] font-black text-slate-300 uppercase tracking-tight">
                   <Icons.Network className="h-4 w-4" /> Unlinked
                </div>
              )}
           </div>
        </div>

        {/* Command Nexus (Footer) */}
        <div className="mt-auto space-y-10">
           <div className="flex items-center gap-6 p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100 group/owner transition-all hover:bg-white hover:shadow-2xl hover:border-emerald-200">
              <div className="h-14 w-14 rounded-[1.25rem] bg-white p-1 shadow-2xl border border-white relative group-hover/owner:rotate-6 transition-transform duration-700 overflow-hidden ring-4 ring-slate-100">
                 {group.owner.avatarUrl ? (
                   <img src={group.owner.avatarUrl} alt="" className="h-full w-full object-cover rounded-xl" />
                 ) : (
                   <div className="h-full w-full flex items-center justify-center bg-slate-50 rounded-xl">
                      <Icons.User className="h-8 w-8 text-slate-200" />
                   </div>
                 )}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1 truncate leading-none">{group.owner.name}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase truncate tracking-[0.1em] leading-none">{group.owner.institution}</p>
              </div>
              <div className="h-10 w-10 flex items-center justify-center text-emerald-500 opacity-0 group-hover/owner:opacity-100 transition-opacity">
                <Icons.Crown className="h-6 w-6" />
              </div>
           </div>

           {showActions && (
             <div className="flex gap-4">
               {canJoin && (
                 <button
                   onClick={() => onJoin?.(group.id)}
                   className="flex-1 h-18 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:bg-emerald-600 transition-all active:scale-95 group/btn overflow-hidden relative"
                 >
                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                   <Icons.UserPlus className="h-6 w-6 text-emerald-400 group-hover/btn:scale-110 transition-transform relative z-10" />
                   <span className="relative z-10">Initiate Tactical Sync</span>
                 </button>
               )}
               
               {isMember && (
                 <div className="flex w-full gap-4">
                   <button
                     onClick={() => onManage?.(group.id)}
                     className="flex-1 h-18 rounded-[2rem] bg-white border border-slate-200 text-slate-900 flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all group/hub active:scale-95 relative overflow-hidden"
                   >
                     <span className="relative z-10">Operational HQ</span>
                     <Icons.ArrowUpRight className="h-6 w-6 group-hover/hub:translate-x-1 group-hover/hub:-translate-y-1 transition-transform text-emerald-500 relative z-10" />
                   </button>
                   
                   {group.userRole !== 'OWNER' && (
                     <button
                       onClick={() => onLeave?.(group.id)}
                       className="h-18 w-18 rounded-[2rem] glass border-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center shadow-xl active:scale-95"
                       title="Terminate Command"
                     >
                       <Icons.Lock className="h-6 w-6" />
                     </button>
                   )}
                 </div>
               )}

               {!isMember && isFull && (
                 <button
                   disabled
                   className="flex-1 h-18 rounded-[2rem] bg-slate-100 border border-slate-200 text-slate-400 font-black text-[11px] uppercase tracking-[0.3em] cursor-not-allowed flex items-center justify-center gap-4"
                 >
                   <Icons.ShieldCheck className="h-6 w-6 opacity-30" />
                   Capacity Saturated
                 </button>
               )}
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
}
