"use client";

import Link from "next/link";
import { 
  useGamificationProfile, 
  useUserBadges, 
  useLeaderboard, 
  useBadgeDefinitions,
  BadgePill, 
  ReputationDisplay 
} from "@cliniq/ui";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
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
            <Icons.ShieldCheck className="h-10 w-10" />
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

  const userRank = leaderboard?.findIndex(u => u.id === userId) ?? -1;
  const userPosition = userRank >= 0 ? userRank + 1 : null;

  return (
    <div className="space-y-20 pb-48 max-w-[90rem] mx-auto px-6 relative">
       <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10 blur-[120px]" />

      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-emerald-500/20 rounded-[4.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative glass rounded-[4rem] p-12 lg:p-20 border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden bg-white/40 backdrop-blur-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-all duration-1000 scale-150 group-hover:rotate-12">
              <Icons.Crown className="h-[400px] w-[400px]" />
           </div>
           
           <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-16 lg:gap-24">
              <div className="relative shrink-0">
                 <div className="h-56 w-56 rounded-[4rem] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-[2px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] relative group/avatar overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-700" />
                    <div className="h-full w-full rounded-[3.9rem] bg-slate-900 flex items-center justify-center overflow-hidden border border-white/5 relative z-10">
                       <Icons.User className="h-32 w-32 text-slate-700 group-hover/avatar:scale-110 transition-transform duration-700" />
                    </div>
                 </div>
                 <motion.div 
                   animate={{ rotate: 360 }} 
                   transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-[-20px] border border-emerald-500/10 rounded-[5rem] pointer-events-none" 
                 />
                 <div className="absolute -bottom-2 -right-2 h-16 w-16 bg-emerald-500 text-white rounded-[1.5rem] border-8 border-white flex items-center justify-center shadow-2xl rotate-6 group-hover:rotate-0 transition-transform">
                    <Icons.ShieldCheck className="h-7 w-7" />
                 </div>
              </div>

              <div className="flex-1 text-center lg:text-left space-y-10">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter heading leading-none">John Doe</h1>
                          <div className="px-6 py-2 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] w-fit mx-auto lg:mx-0 shadow-xl shadow-slate-200 group-hover:bg-emerald-600 transition-colors">
                             Supreme Contributor <span className="text-emerald-400 font-mono">L.10</span>
                          </div>
                       </div>
                       <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
                          <span className="flex items-center gap-3"><Icons.School className="h-4 w-4 text-emerald-500" /> University of Medical Excellence</span>
                          <span className="flex items-center gap-3"><Icons.Target className="h-4 w-4 text-indigo-500" /> Advanced Phase III · Surgical Core</span>
                       </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                       {['Verified Clinical Lead', 'Top 1% Responder', 'Research Sentinel'].map((tag) => (
                          <div key={tag} className="px-5 py-2 glass border-white bg-white/60 rounded-2xl shadow-sm text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {tag}
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-12 pt-4 border-t border-slate-100/50">
                    {[
                      { label: "Global Standing", value: `#${userPosition || '04'}`, color: "text-slate-900", icon: Icons.TrendingUp },
                      { label: "Impact Factor", value: "4.9", color: "text-indigo-600", icon: Icons.Zap },
                      { label: "Pulse Health", value: "98%", color: "text-emerald-600", icon: Icons.Activity },
                      { label: "Authored", value: "142", color: "text-slate-500", icon: Icons.BrainCircuit }
                    ].map((m, i) => (
                      <div key={i} className="space-y-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <m.icon className="h-3 w-3" /> {m.label}
                         </p>
                         <p className={cn("text-3xl font-black heading tracking-tighter", m.color)}>{m.value}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="mt-20 pt-12 border-t border-slate-100/60">
              <ReputationDisplay
                reputation={profile.totalReputation}
                level={profile.level}
                nextLevelReputation={profile.nextLevelReputation}
                showProgress={true}
                className="bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 shadow-inner"
              />
           </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { label: "Aggregate Intelligence", value: profile.totalReputation, color: "text-slate-900", icon: Icons.Activity, metric: "XP DATA" },
          { label: "Answer Authority", value: profile.answerReputation, color: "text-emerald-600", icon: Icons.BrainCircuit, metric: "VERIFIED" },
          { label: "Prestige Assets", value: profile.badgeCount, color: "text-amber-500", icon: Icons.Award, metric: "AWARDS" }
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            key={i}
            className="glass rounded-[3.5rem] p-12 border-white text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-3 transition-all duration-700 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className={cn(
              "h-20 w-20 rounded-[2rem] mx-auto mb-8 flex items-center justify-center bg-slate-50 transition-all group-hover:rotate-12 group-hover:scale-110 shadow-inner border border-slate-100 relative z-10",
              stat.color
            )}>
               <stat.icon className="h-10 w-10" />
            </div>
            <div className="relative z-10 space-y-2">
               <div className={cn("text-5xl font-black heading tracking-tighter leading-none mb-2", stat.color)}>{stat.value.toLocaleString()}</div>
               <div className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">
                  {stat.label}
               </div>
               <div className="px-4 py-1 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] w-fit mx-auto">
                  {stat.metric}
               </div>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-20">
        <section className="space-y-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 border-b border-slate-100 pb-12">
             <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl relative group-hover:rotate-6 transition-transform">
                   <Icons.Award className="h-9 w-9 text-emerald-400" />
                </div>
                <div>
                   <h2 className="text-4xl font-black text-slate-900 heading tracking-tight uppercase">Distinction Vault</h2>
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">Verified clinical assets and academic milestones</p>
                </div>
             </div>
             <div className="px-8 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                <Icons.ShieldCheck className="h-4 w-4 text-emerald-500" />
                {profile.badgeCount} Distinctions
             </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout" initial={false}>
              {badges && badges.length > 0 ? (
                badges.map((badge, _i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: _i * 0.05 }}
                    key={badge.id} 
                    className="glass rounded-[3rem] p-10 text-center border-white hover:border-emerald-200 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)] transition-all duration-700 group relative overflow-hidden flex flex-col items-center min-h-[300px]"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-emerald-500 animate-gradient-x opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-7xl mb-10 transform transition-all group-hover:scale-125 group-hover:rotate-6 duration-1000 filter drop-shadow-2xl">{badge.icon}</div>
                    <BadgePill type={badge.type as any} size="sm" className="mb-6 rounded-2xl px-6 py-2 font-black text-[10px] uppercase tracking-widest shadow-sm" />
                    <p className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter leading-snug mb-6 opacity-80">{badge.description}</p>
                    <div className="mt-auto pt-6 border-t border-slate-50 w-full">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                         ACQUIRED {new Date(badge.awardedAt).toLocaleDateString([], { month: 'long', year: 'numeric' })}
                       </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-32 glass rounded-[4rem] text-center border-dashed border-slate-200 flex flex-col items-center justify-center bg-slate-50/30">
                  <Icons.Hexagon className="h-20 w-20 text-slate-200 mb-8 animate-pulse" />
                  <p className="text-slate-400 text-sm font-black uppercase tracking-[0.4em] px-12 leading-relaxed opacity-60">Vault Status: Sparse. <br/>Engage with the matrix to manifest excellence.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {badgeDefinitions && (
            <div className="space-y-10 pt-16">
               <div className="flex items-center gap-6">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-100" />
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Operational Targets</h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-100" />
               </div>
               <div className="grid grid-cols-1 gap-6">
                  {badgeDefinitions.map((definition: any) => {
                    const isEarned = badges?.some(b => b.type === definition.type);
                    if (isEarned) return null;
                    return (
                      <div 
                        key={definition.type} 
                        className="glass-dark rounded-[2.5rem] p-8 border-white/5 flex items-center gap-10 transition-all group grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:bg-slate-900 border-2 hover:border-emerald-500/30 overflow-hidden relative"
                      >
                        <div className="absolute right-0 top-0 p-8 opacity-[0.02] group-hover:scale-150 transition-transform duration-1000">
                           <Icons.Target className="h-40 w-40" />
                        </div>
                        <div className="text-5xl filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500">{definition.icon}</div>
                        <div className="flex-1 min-w-0 pointer-events-none">
                           <div className="flex items-center gap-4 mb-2">
                              <h4 className="text-xl font-black text-white tracking-tight heading uppercase">{definition.name}</h4>
                              <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                           </div>
                           <p className="text-sm text-slate-400 font-medium leading-relaxed opacity-80">{definition.requirements}</p>
                        </div>
                        <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all relative z-10">
                           <Icons.Target className="h-8 w-8" />
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          )}
        </section>

        <aside className="space-y-20">
           <section className="space-y-8">
              <div className="flex items-center justify-between px-4">
                 <h2 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-4">
                    <Icons.Hexagon className="h-5 w-5 text-emerald-500" />
                    Global Matrix
                 </h2>
                 <Link href="/leaderboard" className="h-10 w-10 glass rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                   <Icons.ChevronRight className="h-6 w-6" />
                 </Link>
              </div>
              
              <div className="glass rounded-[4rem] border-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] overflow-hidden divide-y divide-slate-100/50 relative">
                 <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                 {leaderboard?.slice(0, 5).map((user, index) => {
                   const isCurrentUser = user.id === userId;
                   return (
                     <div 
                       key={user.id} 
                       className={cn(
                         "p-8 flex items-center gap-6 transition-all relative overflow-hidden group/item",
                         isCurrentUser ? "bg-white/90 ring-inset ring-2 ring-emerald-500/10" : "hover:bg-white/60"
                       )}
                     >
                       {isCurrentUser && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />}
                       <div className="w-8 text-[12px] font-black text-slate-300 italic group-hover/item:text-slate-900 transition-colors">
                         {(index + 1).toString().padStart(2, '0')}
                       </div>
                       
                       <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center relative overflow-hidden border border-slate-800 shadow-2xl transition-transform group-hover/item:scale-110">
                          <Icons.User className="h-7 w-7 text-slate-600" />
                          {isCurrentUser && <div className="absolute inset-0 border-2 border-emerald-500/20" />}
                       </div>
                       
                       <div className="flex-1 min-w-0">
                         <p className={cn("text-base font-black truncate heading tracking-tight uppercase leading-none mb-1", isCurrentUser ? "text-emerald-600" : "text-slate-900")}>
                           {user.name}
                         </p>
                         <p className="text-[10px] font-black text-slate-400 uppercase truncate tracking-[0.2em]">{user.institution || 'Neutral Facility'}</p>
                       </div>
                       
                       <div className="text-right">
                         <p className="text-lg font-black text-slate-900 leading-none mb-1">{user.totalReputation.toLocaleString()}</p>
                         <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">PULSE</p>
                       </div>
                     </div>
                   );
                 })}
              </div>
           </section>

           <section className="relative group">
              <div className="absolute -inset-4 bg-indigo-500/10 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="glass-dark rounded-[4rem] p-12 lg:p-14 border-white/5 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col items-center text-center">
                 <div className="absolute -top-20 -right-20 h-64 w-64 bg-indigo-500/10 rounded-full blur-[80px] group-hover:scale-150 transition-all duration-1000" />
                 <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-emerald-500/5 rounded-full blur-[80px] group-hover:scale-150 transition-all duration-1000 delay-300" />
                 
                 <div className="relative z-10 space-y-10 w-full">
                    <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2rem] flex items-center justify-center shadow-[0_25px_50px_-12px_rgba(99,102,241,0.5)] mx-auto rotate-12 group-hover:rotate-0 transition-transform duration-700">
                       <Icons.BrainCircuit className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-3xl font-black text-white heading tracking-tighter uppercase">Intelligence Quotient</h3>
                       <p className="text-slate-400 text-[12px] leading-relaxed font-black uppercase tracking-[0.2em]">
                          Clinical synthesis authority increased by <span className="text-emerald-400 font-mono tracking-normal text-sm">+14.2%</span>. <br/>Fellowship access imminent.
                       </p>
                    </div>
                    <button className="w-full h-16 bg-white text-slate-900 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95 group/btn overflow-hidden relative">
                       <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                       <span className="relative z-10">Strategic Report v.4.1</span>
                    </button>
                 </div>
              </div>
           </section>
        </aside>
      </div>
    </div>
  );
}
