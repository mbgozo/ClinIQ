"use client";

import { 
  User, 
  MessageSquare, 
  Clock, 
  Globe, 
  Lock, 
  Mail, 
  Crown, 
  ShieldCheck, 
  Zap,
  MoreVertical,
  UserPlus,
  Network,
  Activity,
  ArrowUpRight,
  Fingerprint
} from "lucide-react";
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
      case 'PRIVATE': return <Lock className="h-3.5 w-3.5" />;
      case 'INVITE_ONLY': return <Mail className="h-3.5 w-3.5" />;
      default: return <Globe className="h-3.5 w-3.5" />;
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
      case 'OWNER': return { icon: <Crown className="h-4 w-4 text-emerald-500" />, label: 'Lead Architect', color: 'text-emerald-600' };
      case 'ADMIN': return { icon: <Zap className="h-4 w-4 text-indigo-500" />, label: 'Core Admin', color: 'text-indigo-600' };
      case 'MODERATOR': return { icon: <ShieldCheck className="h-4 w-4 text-amber-500" />, label: 'Validator', color: 'text-amber-600' };
      default: return { icon: <User className="h-4 w-4 text-slate-500" />, label: 'Fellow', color: 'text-slate-600' };
    }
  };

  const capacityPercentage = (group.memberCount / group.maxMembers) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "glass group border-white hover:border-emerald-200 transition-all duration-700 shadow-2xl hover:shadow-[0_45px_100px_-20px_rgba(0,0,0,0.15)] rounded-[4rem] overflow-hidden flex flex-col relative",
        className
      )}
    >
      {/* Dynamic Activity Beacon */}
      <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-700" />
      
      <div className="p-10 flex-1 flex flex-col relative z-10">
        {/* Superior Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-3">
             <div className="flex flex-wrap items-center gap-3">
               <h3 className="text-2xl font-black text-slate-900 heading group-hover:text-emerald-700 transition-colors leading-tight tracking-tight">{group.name}</h3>
               {group.category && (
                 <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] shadow-sm">
                   {group.category.name}
                 </span>
               )}
             </div>
             <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2 group-hover:text-slate-600 transition-colors">
                  {getPrivacyIcon(group.privacy)} {group.privacy.replace(/_/g, ' ')}
                </span>
                <span className="flex items-center gap-2 group-hover:text-slate-600 transition-colors">
                  <Activity className="h-4 w-4 text-emerald-500" /> {formatCadenceLabel(group.cadence)}
                </span>
             </div>
          </div>

          <div className="h-12 w-12 rounded-2xl glass border-white flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white cursor-pointer transition-all active:scale-90 shadow-sm">
             <MoreVertical className="h-6 w-6" />
          </div>
        </div>

        {/* Descriptive Core */}
        <p className="text-base text-slate-500 mb-10 line-clamp-2 font-medium leading-relaxed">
          {group.description}
        </p>

        {/* Capacity Matrix & Intel Nodes */}
        <div className="space-y-8 mb-10 pb-10 border-b border-slate-100/50">
           <div className="flex items-end justify-between">
              <div className="space-y-3">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Cohort</p>
                 <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-[1.25rem] border-3 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-xl ring-2 ring-slate-50 relative group/icon">
                         <User className="h-5 w-5 text-slate-300 group-hover/icon:text-emerald-500 transition-colors" />
                      </div>
                    ))}
                    <div className="h-10 w-10 rounded-[1.25rem] border-3 border-white bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white shadow-xl ring-2 ring-emerald-50 relative z-10">
                       +{group.memberCount}
                    </div>
                 </div>
              </div>
              
              <div className="text-right space-y-3">
                 <div className="flex items-center justify-end gap-3 text-xs font-black text-slate-900 uppercase">
                   {isFull ? <span className="text-rose-600">Saturation Limit</span> : <span>{group.maxMembers - group.memberCount} Nodes Remaining</span>}
                   <Fingerprint className={cn("h-4 w-4", isFull ? "text-rose-500" : "text-emerald-500")} />
                 </div>
                 <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${capacityPercentage}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className={cn(
                        "h-full rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
                        isFull ? "bg-rose-500" : "bg-gradient-to-r from-emerald-500 to-indigo-600"
                      )} 
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Intel Metrics Grid */}
        <div className="grid grid-cols-3 gap-6 mb-12">
           <div className="space-y-2 group/metric">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 group-hover/metric:text-emerald-500 transition-colors">
                 <MessageSquare className="h-3.5 w-3.5" /> Intel Hub
              </p>
              <p className="text-base font-black text-slate-900 heading tracking-tight">{group.postCount} Dispatches</p>
           </div>
           <div className="space-y-2 group/metric">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 group-hover/metric:text-indigo-500 transition-colors">
                 <Clock className="h-3.5 w-3.5" /> Sync Pulse
              </p>
              <p className="text-base font-black text-slate-900 heading tracking-tight">{formatDate(group.lastActivity)}</p>
           </div>
           <div className="space-y-2 group/metric">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 group-hover/metric:text-amber-500 transition-colors">
                 <Fingerprint className="h-3.5 w-3.5" /> Identity
              </p>
              {group.userRole ? (
                <div className={cn("flex items-center gap-2 text-[11px] font-black uppercase tracking-tight", getRoleLabel().color)}>
                   {getRoleLabel().icon} {getRoleLabel().label}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[11px] font-black text-slate-300 uppercase tracking-tight">
                   <Network className="h-3.5 w-3.5" /> Outsider
                </div>
              )}
           </div>
        </div>

        {/* Command Nexus (Footer) */}
        <div className="mt-auto space-y-8">
           <div className="flex items-center gap-5 p-4 bg-slate-50/50 rounded-3xl border border-slate-100 group/owner transition-all hover:bg-white hover:shadow-xl hover:border-emerald-100">
              <div className="h-12 w-12 rounded-[1.25rem] bg-white p-0.5 shadow-xl border border-slate-100 relative group-hover/owner:rotate-6 transition-transform duration-500 overflow-hidden">
                 {group.owner.avatarUrl ? (
                   <img src={group.owner.avatarUrl} alt="" className="h-full w-full object-cover rounded-xl" />
                 ) : (
                   <div className="h-full w-full flex items-center justify-center bg-slate-50 rounded-xl">
                      <User className="h-6 w-6 text-slate-300" />
                   </div>
                 )}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1 truncate">{group.owner.name}</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase truncate tracking-[0.1em]">{group.owner.institution}</p>
              </div>
              <div className="h-10 w-10 flex items-center justify-center text-emerald-500 opacity-0 group-hover/owner:opacity-100 transition-opacity">
                <Crown className="h-5 w-5" />
              </div>
           </div>

           {showActions && (
             <div className="flex gap-4">
               {canJoin && (
                 <button
                   onClick={() => onJoin?.(group.id)}
                   className="flex-1 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-[0.2em] shadow-3xl shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95 group/btn"
                 >
                   <UserPlus className="h-5 w-5 text-emerald-400 group-hover/btn:scale-110 transition-transform" />
                   Initiate Strategic Entry
                 </button>
               )}
               
               {isMember && (
                 <div className="flex w-full gap-4">
                   <button
                     onClick={() => onManage?.(group.id)}
                     className="flex-1 h-16 rounded-[1.5rem] bg-white border-2 border-slate-900/5 text-slate-900 flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 hover:text-white transition-all group/hub active:scale-95"
                   >
                     Intel Command <ArrowUpRight className="h-5 w-5 group-hover/hub:translate-x-1 group-hover/hub:-translate-y-1 transition-transform text-emerald-500" />
                   </button>
                   
                   {group.userRole !== 'OWNER' && (
                     <button
                       onClick={() => onLeave?.(group.id)}
                       className="h-16 w-16 rounded-[1.5rem] glass-dark border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center shadow-xl active:scale-95"
                       title="Terminate Connection"
                     >
                       <Lock className="h-5 w-5" />
                     </button>
                   )}
                 </div>
               )}

               {!isMember && isFull && (
                 <button
                   disabled
                   className="flex-1 h-16 rounded-[1.5rem] bg-slate-100 border-2 border-slate-200 text-slate-300 font-black text-[11px] uppercase tracking-[0.2em] cursor-not-allowed flex items-center justify-center gap-3"
                 >
                   <ShieldCheck className="h-5 w-5 opacity-30" />
                   Max Capacity Reached
                 </button>
               )}
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
}
