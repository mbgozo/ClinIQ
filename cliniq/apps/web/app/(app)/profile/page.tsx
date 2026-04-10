"use client";

import Link from "next/link";
import { 
  useGamificationProfile, 
  useUserBadges, 
  useLeaderboard, 
  useBadgeDefinitions 
} from "@cliniq/ui";
import { BadgePill, ReputationDisplay } from "@cliniq/ui";
import { 
  User, 
  Award, 
  TrendingUp, 
  Activity, 
  BrainCircuit, 
  School, 
  Target,
  ChevronRight,
  ShieldCheck,
  Zap,
  Hexagon,
  Sparkles,
  Crown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";

export default function ProfilePage() {
  // Mock user ID - replace with actual auth context
  const userId = "mock-user-id";
  
  const { data: profile, isLoading: profileLoading } = useGamificationProfile(userId);
  const { data: badges, isLoading: badgesLoading } = useUserBadges(userId);
  const { data: leaderboard } = useLeaderboard();
  const { data: badgeDefinitions } = useBadgeDefinitions();

  if (profileLoading || badgesLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-20 w-20">
             <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin" />
             <div className="absolute inset-4 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin-slow" />
          </div>
          <p className="text-slate-900 font-bold uppercase tracking-[0.3em] text-xs">Synchronizing Portfolio</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-[70vh] items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-dark p-12 rounded-[3.5rem] border-white/10 max-w-md shadow-3xl text-white"
        >
          <div className="h-20 w-20 bg-white/5 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold mb-3 heading">Identity Sync Terminated</h3>
          <p className="text-slate-400 text-sm mb-10 leading-relaxed">Failed to establish a secure link with the central clinical archive. Re-authenticate to access your portfolio.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-400 transition-all active:scale-95"
          >
            Re-Establish Link
          </button>
        </motion.div>
      </div>
    );
  }

  // Find user's rank in leaderboard
  const userRank = leaderboard?.findIndex(u => u.id === userId) ?? -1;
  const userPosition = userRank >= 0 ? userRank + 1 : null;

  return (
    <div className="space-y-16 pb-40 max-w-7xl mx-auto">
      {/* Portfolio Command Center (Header) */}
      <section className="relative glass rounded-[4rem] p-12 lg:p-16 border-white shadow-3xl overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
           <Crown className="h-96 w-96 transform rotate-12" />
        </div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-emerald-500/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col lg:flex-row items-center gap-16">
           {/* Elite Avatar Nexus */}
           <div className="relative group/avatar">
              <div className="h-44 w-44 rounded-[3.5rem] bg-gradient-to-br from-emerald-500 via-emerald-600 to-indigo-700 p-1.5 shadow-3xl transform group-hover/avatar:rotate-3 transition-transform duration-700">
                 <div className="h-full w-full rounded-[3rem] bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-slate-800">
                    <User className="h-24 w-24 text-slate-700" />
                 </div>
              </div>
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-15px] border border-dashed border-emerald-500/20 rounded-full pointer-events-none" 
              />
              <div className="absolute -bottom-2 -right-2 h-14 w-14 bg-slate-900 rounded-2xl border-4 border-white flex items-center justify-center text-amber-400 shadow-3xl">
                 <Crown className="h-7 w-7" />
              </div>
           </div>

           {/* Identity & Status */}
           <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="space-y-2">
                 <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight heading">John Doe</h1>
                    <div className="px-5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] w-fit mx-auto lg:mx-0">
                       Supreme Contributor v4.1
                    </div>
                 </div>
                 <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                    <span className="flex items-center gap-2"><School className="h-4 w-4 text-emerald-500" /> University of Ghana</span>
                    <span className="flex items-center gap-2"><Target className="h-4 w-4 text-indigo-500" /> Core Clinical · Phase III</span>
                 </div>
              </div>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                 {['verified-provider', 'community-leader', 'research-author'].map((tag) => (
                    <span key={tag} className="px-4 py-1.5 bg-slate-100 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200/50">
                       {tag.split('-').join(' ')}
                    </span>
                 ))}
              </div>
           </div>

           {/* Performance Hub */}
           <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-3xl shadow-slate-200 text-center min-w-[180px]">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Global Standing</p>
                 <p className="text-5xl font-black heading tracking-tighter">#{userPosition || '--'}</p>
                 <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                    <TrendingUp className="h-3.5 w-3.5" /> Top 0.2% Net
                 </div>
              </div>
              <div className="glass rounded-[2.5rem] p-8 text-center min-w-[180px] border-emerald-100">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impact Factor</p>
                 <p className="text-5xl font-black heading tracking-tighter text-indigo-600">4.9</p>
                 <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                    <Zap className="h-3.5 w-3.5" /> Verified
                 </div>
              </div>
           </div>
        </div>

        {/* Dynamic Progression Bar */}
        <div className="mt-16 pt-10 border-t border-slate-100">
           <ReputationDisplay
             reputation={profile.totalReputation}
             level={profile.level}
             nextLevelReputation={profile.nextLevelReputation}
             showProgress={true}
             className="bg-emerald-500/5 p-8 rounded-[2.5rem]"
           />
        </div>
      </section>

      {/* Analytics Matrix */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { label: "Aggregate Intel", value: profile.totalReputation, color: "text-slate-900", icon: Activity, metric: "XP" },
          { label: "Response Authority", value: profile.answerReputation, color: "text-emerald-600", icon: BrainCircuit, metric: "Verified" },
          { label: "Prestige Assets", value: profile.badgeCount, color: "text-amber-500", icon: Award, metric: "Distinctions" }
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="glass rounded-[3rem] p-10 border-white text-center shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 group"
          >
            <div className={cn(
              "h-16 w-16 rounded-[1.5rem] mx-auto mb-6 flex items-center justify-center bg-slate-50 transition-transform group-hover:rotate-6 shadow-inner border border-slate-100",
              stat.color
            )}>
               <stat.icon className="h-8 w-8" />
            </div>
            <div className={cn("text-4xl font-black heading mb-1", stat.color)}>{stat.value.toLocaleString()}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex flex-col items-center gap-1">
               {stat.label}
               <span className="h-1 w-6 bg-slate-100 rounded-full mt-1" />
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
        {/* Distinction Vault */}
        <section className="space-y-12">
          <div className="flex items-center justify-between border-b border-slate-100 pb-8">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-3xl shadow-emerald-100">
                   <Award className="h-7 w-7" />
                </div>
                <div>
                   <h2 className="text-3xl font-black text-slate-900 heading">Distinction Vault</h2>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Acquired prestige assets in clinical service</p>
                </div>
             </div>
             <div className="px-5 py-2 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {profile.badgeCount} Distinctions
             </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {badges && badges.length > 0 ? (
                badges.map((badge, _i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={badge.id} 
                    className="glass rounded-[2.5rem] p-8 text-center border-white hover:border-emerald-200 hover:shadow-3xl transition-all duration-500 group relative overflow-hidden flex flex-col items-center"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-6xl mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-6 duration-700">{badge.icon}</div>
                    <BadgePill type={badge.type as any} size="sm" className="mb-4 rounded-xl px-4 py-1 font-black text-[9px]" />
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter leading-relaxed mb-4">{badge.description}</p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase mt-auto tracking-widest">
                      ACQUIRED {new Date(badge.awardedAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-24 glass rounded-[3rem] text-center border-dashed border-slate-200 flex flex-col items-center justify-center">
                  <Hexagon className="h-12 w-12 text-slate-200 mb-6" />
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest px-10">Vault Status: Sparse. <br/>Manifest excellence to acquire assets.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Potential Assets (Locked) */}
          {badgeDefinitions && (
            <div className="space-y-8 pt-12">
               <div className="flex items-center gap-4">
                  <div className="h-0.5 flex-1 bg-slate-100" />
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Targets</h3>
                  <div className="h-0.5 flex-1 bg-slate-100" />
               </div>
               <div className="grid grid-cols-1 gap-6">
                  {badgeDefinitions.map((definition: any) => {
                    const isEarned = badges?.some(b => b.type === definition.type);
                    if (isEarned) return null; // Only show locked ones here for cleaner UI
                    return (
                      <div 
                        key={definition.type} 
                        className="glass-dark rounded-[2rem] p-6 border-white/5 flex items-center gap-8 transition-all group grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:bg-slate-900 border-2 hover:border-emerald-500/20"
                      >
                        <div className="text-4xl filter drop-shadow-2xl group-hover:scale-110 transition-transform">{definition.icon}</div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-base font-bold text-white tracking-tight heading">{definition.name}</h4>
                              <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
                           </div>
                           <p className="text-[11px] text-slate-400 font-medium">{definition.requirements}</p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all">
                           <Target className="h-6 w-6" />
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          )}
        </section>

        {/* Tactical Intel (Sidebar) */}
        <aside className="space-y-12">
           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                    <Hexagon className="h-4 w-4 text-emerald-500" />
                    Global Matrix
                 </h2>
                 <Link href="/leaderboard" className="h-8 w-8 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all shadow-sm">
                   <ChevronRight className="h-5 w-5" />
                 </Link>
              </div>
              
              <div className="glass rounded-[3rem] border-white shadow-3xl overflow-hidden divide-y divide-slate-50">
                 {leaderboard?.slice(0, 5).map((user, index) => {
                   const isCurrentUser = user.id === userId;
                   return (
                     <div 
                       key={user.id} 
                       className={cn(
                         "p-6 flex items-center gap-5 transition-all",
                         isCurrentUser ? "bg-emerald-500/5" : "hover:bg-slate-50/50"
                       )}
                     >
                       <div className="w-6 text-[11px] font-black text-slate-300 italic">
                         {(index + 1).toString().padStart(2, '0')}
                       </div>
                       
                       <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center relative overflow-hidden border border-slate-200 shadow-inner">
                          <User className="h-6 w-6 text-slate-300" />
                          {isCurrentUser && <div className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-500/20" />}
                       </div>
                       
                       <div className="flex-1 min-w-0">
                         <p className={cn("text-sm font-bold truncate heading", isCurrentUser ? "text-emerald-700" : "text-slate-900")}>
                           {user.name}
                         </p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase truncate tracking-widest">{user.institution}</p>
                       </div>
                       
                       <div className="text-right">
                         <p className="text-sm font-black text-slate-900">{user.totalReputation.toLocaleString()}</p>
                         <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Verified</p>
                       </div>
                     </div>
                   );
                 })}
              </div>
           </div>

           {/* Analytical Core Highlight */}
           <div className="glass-dark rounded-[3.5rem] p-10 border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000" />
              <div className="relative z-10 space-y-8">
                 <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-3xl shadow-indigo-500/20 rotate-6 group-hover:rotate-0 transition-transform duration-700">
                    <BrainCircuit className="h-8 w-8 text-white" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-white mb-3 heading tracking-tight">Intelligence Quotient</h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed font-medium uppercase tracking-[0.1em]">Your clinical synthesis authority has increased by <span className="text-emerald-400">14.2%</span> in the last cycle. Maintain peer validation to accelerate Fellowship access.</p>
                 </div>
                 <button className="w-full h-14 bg-white text-indigo-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-50 transition-all active:scale-95">
                    View Strategic Report
                 </button>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
