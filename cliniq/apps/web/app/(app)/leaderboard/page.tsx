"use client";

import { useState } from "react";
import { useLeaderboard, ReputationDisplay } from "@cliniq/ui";
import { motion } from "framer-motion";
import { 
  Medal, 
  Crown, 
  TrendingUp, 
  Info,
  Hexagon,
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  Star,
  MessageSquare,
  Network,
  Activity,
  Award,
  Fingerprint,
  Orbit,
  ArrowUpRight
} from "lucide-react";
import { cn } from "../../../lib/utils";

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all");
  const { data: leaderboard, isLoading } = useLeaderboard();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-10">
          <div className="relative h-32 w-32 flex items-center justify-center">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 rounded-full border-4 border-emerald-500/5 border-t-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]" 
             />
             <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
               className="absolute inset-4 rounded-full border-4 border-indigo-500/5 border-t-indigo-500" 
             />
             <Orbit className="h-10 w-10 text-emerald-500 animate-pulse" />
          </div>
          <div className="text-center space-y-3">
             <p className="text-slate-900 font-black uppercase tracking-[0.5em] text-sm">Synchronizing Matrix</p>
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Accessing global reputation consensus...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!leaderboard) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-dark p-16 rounded-[4rem] border-white/5 max-w-xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] text-white"
        >
          <div className="h-24 w-24 bg-white/5 text-amber-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-3xl">
            <Info className="h-12 w-12" />
          </div>
          <h3 className="text-3xl font-black mb-4 heading tracking-tight">Consensus Interrupted</h3>
          <p className="text-slate-400 text-lg mb-12 leading-relaxed">The community achievement ledger has disconnected from the primary node. Manual re-engagement is required to restore rank visibility.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full h-16 bg-white text-slate-900 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-3xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
          >
            Re-Initialize Protocol
          </button>
        </motion.div>
      </div>
    );
  }

  const currentUserId = "mock-user-id";

  const getRankData = (rank: number) => {
    switch (rank) {
      case 1: return { 
        icon: <Crown className="h-10 w-10" />, 
        color: "text-amber-400", 
        glow: "shadow-[0_0_50px_rgba(251,191,36,0.2)]",
        border: "border-amber-400/30",
        label: "Supreme Architect"
      };
      case 2: return { 
        icon: <Award className="h-8 w-8" />, 
        color: "text-slate-300", 
        glow: "shadow-[0_0_50px_rgba(203,213,225,0.2)]",
        border: "border-slate-300/30",
        label: "Elite Vanguard"
      };
      case 3: return { 
        icon: <Medal className="h-7 w-7" />, 
        color: "text-orange-400", 
        glow: "shadow-[0_0_50px_rgba(251,146,60,0.2)]",
        border: "border-orange-400/30",
        label: "Master Analyst"
      };
      default: return { 
        icon: null, 
        color: "text-slate-400", 
        glow: "shadow-none",
        border: "border-white/10",
        label: "Field Clinical"
      };
    }
  };

  return (
    <div className="space-y-32 pb-40">
      {/* Executive Header Segment */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative">
        <div className="absolute top-0 right-0 h-96 w-96 bg-emerald-500/5 rounded-full blur-[120px] -z-10 animate-pulse" />
        
        <div className="space-y-6 max-w-3xl">
          <div className="flex items-center gap-4 px-5 py-2 rounded-full bg-slate-900 text-white w-fit shadow-2xl">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Strategic Achievement Matrix</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-slate-900 heading leading-[0.9]">
             The <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 via-indigo-700 to-emerald-900">Aurelius Matrix</span>
          </h1>
          <p className="text-slate-500 text-2xl leading-tight font-medium tracking-tight">
            Codifying clinical impact. Honoring the elite practitioners driving the future of scholarship.
          </p>
        </div>

        <div className="flex p-2 bg-slate-100/80 rounded-[2.5rem] w-fit shadow-3xl border border-slate-200/50 backdrop-blur-xl">
          {["week", "month", "all"].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter as any)}
              className={cn(
                "px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-700",
                timeFilter === filter
                  ? "bg-white text-slate-900 shadow-3xl transform -translate-y-1"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {filter === "week" ? "Cycle" : filter === "month" ? "Phase" : "Eternity"}
            </button>
          ))}
        </div>
      </section>

      {/* Podium of Transcendence */}
      <section className="grid grid-cols-1 lg:grid-cols-3 items-end gap-16 pt-16 px-4">
        {[leaderboard[1], leaderboard[0], leaderboard[2]].map((user, index) => {
          if (!user) return null;
          const actualRank = index === 0 ? 2 : index === 1 ? 1 : 3;
          const rankData = getRankData(actualRank);
          const isWinner = actualRank === 1;

          return (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: actualRank * 0.2, type: "spring", stiffness: 50, damping: 20 }}
              key={user.id}
              className={cn(
                "relative group",
                isWinner ? "lg:order-2" : index === 0 ? "lg:order-1" : "lg:order-3"
              )}
            >
              <div className={cn(
                "glass flex flex-col items-center p-14 lg:p-16 rounded-[5rem] border transition-all duration-1000 relative overflow-hidden",
                isWinner 
                  ? "border-emerald-300 bg-white lg:-translate-y-20 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.15)] ring-1 ring-emerald-500/10" 
                  : "border-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]",
                "group-hover:translate-y-[-24px] group-hover:shadow-[0_100px_180px_-40px_rgba(0,0,0,0.2)]"
              )}>
                {/* Prestige Overlay */}
                {isWinner && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-amber-400 via-emerald-600 to-indigo-900 animate-gradient-x" />
                    <Sparkles className="absolute top-10 right-10 h-10 w-10 text-amber-400/20 animate-pulse" />
                  </>
                )}

                {/* Avatar Core */}
                <div className={cn(
                  "relative mb-14",
                  isWinner ? "h-40 w-40 lg:h-56 lg:w-56" : "h-36 w-36"
                )}>
                  <div className={cn(
                    "absolute inset-0 rounded-[3.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-1000",
                    isWinner ? "bg-emerald-500/10 scale-110" : "bg-slate-50"
                  )} />
                  <div className={cn(
                    "relative h-full w-full rounded-[3rem] glass flex items-center justify-center border-3 overflow-hidden shadow-3xl transition-all duration-1000 group-hover:rounded-[4rem]",
                    rankData.border
                  )}>
                    <div className="h-full w-full bg-slate-50 flex items-center justify-center relative overflow-hidden">
                       <Fingerprint className={cn("text-slate-100", isWinner ? "h-32 w-32" : "h-24 w-24")} />
                       {isWinner && (
                         <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/30 via-transparent to-indigo-500/30 mix-blend-overlay" />
                       )}
                    </div>
                  </div>
                  
                  {/* Rank Insignia Card */}
                  <div className={cn(
                    "absolute -bottom-6 -right-6 h-20 w-20 lg:h-24 lg:w-24 rounded-[2rem] flex items-center justify-center shadow-[0_30px_60px_-10px_rgba(0,0,0,0.3)] border-3 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-700",
                    "bg-slate-900", rankData.border, rankData.color, rankData.glow
                  )}>
                    {rankData.icon || <span className="text-3xl font-black italic">#{actualRank}</span>}
                  </div>
                </div>

                <div className="text-center space-y-4 mb-14">
                   <div className="flex items-center justify-center gap-3">
                      <Star className={cn("h-4 w-4 fill-current", isWinner ? "text-amber-400" : "text-slate-200")} />
                      <span className={cn("text-[11px] font-black uppercase tracking-[0.4em]", rankData.color)}>
                        {rankData.label}
                      </span>
                   </div>
                   <h3 className={cn(
                     "font-black text-slate-900 line-clamp-1 heading leading-none tracking-tight",
                     isWinner ? "text-4xl lg:text-5xl" : "text-3xl"
                   )}>
                     {user.name}
                   </h3>
                   <div className="flex flex-col items-center gap-1.5 pt-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Hexagon className="h-3 w-3 text-emerald-500" /> {user.institution}
                     </p>
                     <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.5em]">{user.program}</p>
                   </div>
                </div>

                {/* Performance HUD */}
                <ReputationDisplay
                  reputation={user.totalReputation}
                  level={user.level}
                  nextLevelReputation={user.nextLevelReputation}
                  showProgress={isWinner}
                  variant={isWinner ? "light" : "light"}
                  className={cn(
                    "w-full rounded-[2.5rem] border-none",
                    isWinner ? "bg-slate-900 p-8 shadow-3xl text-white" : "bg-transparent shadow-none"
                  )}
                />

                <div className="mt-14 flex items-center gap-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] w-full justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-slate-900 text-2xl font-black heading leading-none">{user.badgeCount}</span>
                    <span className="opacity-60">DISTINCTIONS</span>
                  </div>
                  <div className="h-10 w-px bg-slate-100" />
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-emerald-500 text-2xl font-black heading leading-none">+{actualRank}k</span>
                    <span className="opacity-60">PRECISION</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Global Clinical Matrix */}
      <section className="space-y-12">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
             <div className="h-16 w-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center shadow-3xl relative">
                <div className="absolute -inset-2 bg-emerald-500/20 rounded-3xl blur-xl animate-pulse" />
                <Target className="h-8 w-8 relative z-10" />
             </div>
             <div>
                <h2 className="text-4xl font-black text-slate-900 heading tracking-tight">Ecosystem Rankings</h2>
                <div className="flex items-center gap-3 mt-1">
                   <Network className="h-3.5 w-3.5 text-emerald-500" />
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Verified Intellectual Nodes</p>
                </div>
             </div>
          </div>
          <div className="hidden lg:flex px-8 py-3 rounded-2xl bg-white border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] items-center gap-4 shadow-xl">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Active Personnel: {leaderboard.length.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {leaderboard.slice(3).map((user, index) => {
            const rank = index + 4;
            const isOwn = user.id === currentUserId;

            return (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                key={user.id}
                className={cn(
                  "p-8 lg:p-10 flex items-center gap-10 rounded-[3rem] transition-all duration-700 group border h-32",
                  isOwn 
                    ? "bg-slate-900 border-white/5 shadow-3xl text-white transform -translate-y-2" 
                    : "glass border-white/80 hover:border-emerald-200 hover:shadow-2xl hover:bg-white hover:-translate-y-2"
                )}
              >
                <div className="w-16 text-center">
                   <span className={cn(
                     "text-2xl font-black italic transition-colors",
                     isOwn ? "text-emerald-400" : "text-slate-200 group-hover:text-emerald-500"
                   )}>
                     #{rank.toString().padStart(2, '0')}
                   </span>
                </div>

                <div className={cn(
                  "h-20 w-20 rounded-[1.5rem] flex items-center justify-center border transition-all duration-700 group-hover:rounded-[2rem] overflow-hidden relative shadow-inner",
                  isOwn ? "bg-white/10 border-white/10" : "bg-slate-50 border-slate-100"
                )}>
                   <Fingerprint className={cn("h-10 w-10", isOwn ? "text-white/20" : "text-slate-200 group-hover:text-emerald-400")} />
                   {isOwn && (
                     <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
                   )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4">
                    <h4 className={cn(
                      "text-2xl font-black heading tracking-tight group-hover:text-emerald-700 transition-colors",
                      isOwn ? "text-white" : "text-slate-900"
                    )}>{user.name}</h4>
                    {isOwn && (
                      <span className="bg-emerald-500 text-[9px] font-black text-white px-4 py-1.5 rounded-full tracking-[0.4em] uppercase shadow-lg shadow-emerald-500/30">Primary Identity</span>
                    )}
                  </div>
                  <div className="flex items-center gap-5 mt-2">
                     <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2", isOwn ? "text-slate-400" : "text-slate-400")}>
                        {user.institution}
                     </p>
                     <div className={cn("h-1 w-1 rounded-full", isOwn ? "bg-white/20" : "bg-slate-200")} />
                     <p className={cn("text-[8px] font-bold uppercase tracking-[0.2em]", isOwn ? "text-slate-500" : "text-slate-300")}>
                        {user.program}
                     </p>
                  </div>
                </div>

                <div className={cn("hidden md:flex flex-col items-end px-12 border-x", isOwn ? "border-white/10" : "border-slate-50")}>
                  <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] mb-1", isOwn ? "text-slate-500" : "text-slate-400")}>Consensus XP</p>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-3xl font-black heading leading-none", isOwn ? "text-emerald-400" : "text-slate-900")}>{user.totalReputation.toLocaleString()}</span>
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>

                <div className="hidden lg:flex px-12 items-center gap-4 min-w-[200px]">
                   <ShieldCheck className={cn("h-6 w-6", isOwn ? "text-emerald-400" : "text-emerald-600")} />
                   <div className="space-y-0.5">
                      <p className={cn("text-[9px] font-black uppercase tracking-widest", isOwn ? "text-slate-500" : "text-slate-400")}>Status Cohort</p>
                      <span className={cn("text-xs font-black uppercase leading-none tracking-tighter", isOwn ? "text-white" : "text-slate-900")}>{user.level}</span>
                   </div>
                </div>

                <div className={cn(
                  "h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-xl active:scale-95 cursor-pointer",
                  isOwn ? "bg-white text-slate-900" : "glass border-white/20 hover:bg-emerald-600 hover:text-white group-hover:shadow-emerald-500/30"
                )}>
                  <ArrowUpRight className="h-7 w-7 transform group-hover:scale-110 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Prestige Architecture Visualization */}
      <section className="glass rounded-[5rem] p-20 lg:p-28 border-white relative overflow-hidden shadow-[0_100px_200px_-50px_rgba(0,0,0,0.1)]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-indigo-500/5" />
        <div className="absolute top-0 right-0 h-full w-1/3 bg-emerald-500/5 blur-[120px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-24">
          <div className="relative group/prestige">
             <div className="h-44 w-44 bg-slate-900 text-white rounded-[4rem] flex items-center justify-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] rotate-6 group-hover/prestige:rotate-0 transition-transform duration-1000 border-4 border-white/5">
                <Crown className="h-24 w-24 text-emerald-400" />
             </div>
             <div className="absolute -bottom-8 -right-8 h-24 w-24 bg-white rounded-[2rem] shadow-3xl flex items-center justify-center border-3 border-slate-50">
                <Star className="h-10 w-10 text-amber-500 animate-spin-slow" />
             </div>
          </div>
          <div className="flex-1 space-y-12 text-center lg:text-left">
            <div className="space-y-4">
              <h3 className="text-5xl font-black text-slate-900 heading tracking-tighter">Prestige Geometry</h3>
              <p className="text-slate-500 font-medium max-w-2xl text-xl leading-relaxed">Reputation vectors are codified based on clinical impact, ecological value, and peer consensus. Elevate your status through verified scholarship.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-4">
              {[
                { label: "Answer Matrix", pts: "+10 XP", icon: <MessageSquare className="h-6 w-6" />, color: "text-emerald-500" },
                { label: "Heuristic Validated", pts: "+50 XP", icon: <Zap className="h-6 w-6" />, color: "text-amber-500" },
                { label: "Scholarship Signal", pts: "+5 XP", icon: <TrendingUp className="h-6 w-6" />, color: "text-indigo-600" },
                { label: "Operational Hub", pts: "+20 XP", icon: <Network className="h-6 w-6" />, color: "text-emerald-900" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center lg:items-start group/stat">
                  <div className={cn("font-black text-3xl heading mb-3 transition-transform group-hover/stat:translate-x-2", item.color)}>
                    {item.pts}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
                     {item.icon} {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
