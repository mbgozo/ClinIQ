"use client";

import { 
  SystemStats, 
  SystemAlert, 
  AdminRole, 
  Permission
} from '@cliniq/shared-types';
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

interface AdminDashboardProps {
  stats?: SystemStats;
  alerts?: SystemAlert[];
  userRole?: AdminRole;
  userPermissions?: Permission[];
  className?: string;
}

export function AdminDashboard({ 
  stats, 
  alerts = [], 
  userRole: _userRole = AdminRole.ADMIN,
  userPermissions = [],
  className = ''
}: AdminDashboardProps) {
  const hasPermission = (permission: Permission) => {
    return userPermissions.includes(permission);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'INFO': return <Icons.Info className="h-5 w-5" />;
      case 'WARNING': return <Icons.AlertTriangle className="h-5 w-5" />;
      case 'ERROR': return <Icons.AlertCircle className="h-5 w-5" />;
      case 'SUCCESS': return <Icons.CheckCircle2 className="h-5 w-5" />;
      case 'MAINTENANCE': return <Icons.Settings className="h-5 w-5" />;
      default: return <Icons.Info className="h-5 w-5" />;
    }
  };

  const getAlertStyles = (type: string) => {
    const styles: Record<string, string> = {
      INFO: 'bg-indigo-500/5 border-indigo-500/20 text-indigo-400',
      WARNING: 'bg-amber-500/5 border-amber-500/20 text-amber-400',
      ERROR: 'bg-rose-500/5 border-rose-500/20 text-rose-400',
      SUCCESS: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400',
      MAINTENANCE: 'bg-slate-500/5 border-slate-500/20 text-slate-400',
    };
    return styles[type] || styles.INFO;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const formatPercentage = (num: number) => {
    return num.toFixed(1) + '%';
  };

  const dismissAlert = async (alertId: string) => {
    console.log('Dismissing alert:', alertId);
  };

  const NeuralStatCard = ({ title, value, subtitle, icon, color, trend, index }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    trend?: { value: number; isPositive: boolean };
    index: number;
  }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="glass-dark border-white/10 rounded-[2rem] p-8 hover:border-emerald-500/30 transition-all group relative overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] bg-slate-900/40 backdrop-blur-3xl"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity scale-150 rotate-12">
         {icon}
      </div>
      
      <div className="flex flex-col h-full space-y-6 relative z-10">
        <div className="flex items-center justify-between">
           <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-inner", color)}>
              {icon}
           </div>
           {trend && (
             <div className={cn(
               "flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-md",
               trend.isPositive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
             )}>
               <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", trend.isPositive ? "bg-emerald-500" : "bg-rose-500")} />
               {formatPercentage(trend.value)}
             </div>
           )}
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">{title}</p>
          <p className="text-4xl font-black heading tracking-tighter text-white leading-none">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <div className="flex items-center gap-2 pt-2">
               <div className="h-1 w-1 rounded-full bg-slate-700" />
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{subtitle}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={cn("space-y-16 pb-24", className)}>
      <AnimatePresence>
        {alerts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
               <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Critical System Broadcasts</h3>
               </div>
               <div className="px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-[9px] font-black text-rose-400 uppercase tracking-[0.2em]">
                  {alerts.length} Active Faults
               </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {alerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className={cn(
                    "relative border-l-[6px] rounded-[2.5rem] p-8 lg:p-10 overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]",
                    getAlertStyles(alert.type)
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="flex items-start justify-between relative z-10 gap-10">
                    <div className="flex items-start gap-8">
                      <div className="mt-2 h-16 w-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                         {getAlertIcon(alert.type)}
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                           <div className="flex items-center gap-3">
                              <h3 className="text-2xl font-black heading tracking-tight text-white uppercase">{alert.title}</h3>
                              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest opacity-60">ID: {alert.id.slice(0, 8)}</span>
                           </div>
                           <p className="text-base font-medium opacity-80 leading-relaxed max-w-4xl text-slate-300">{alert.message}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 flex items-center gap-3">
                              <Icons.Clock className="h-3.5 w-3.5" /> ORIGIN_TS: {new Date(alert.startsAt).toISOString().replace('T', ' ').slice(0, 19)}
                           </span>
                           <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 flex items-center gap-3">
                              <Icons.Monitor className="h-3.5 w-3.5" /> SCOPE: GLOBAL_MATRIX
                           </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all active:scale-90 border border-white/10 text-white font-black text-xl hover:rotate-90"
                      aria-label="Dismiss alert"
                    >
                      ×
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      <section className="space-y-8">
         <div className="flex items-center gap-4 px-4">
            <Icons.Zap className="h-6 w-6 text-emerald-500" />
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Operational Directives</h3>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { label: "Personnel Nexus", icon: <Icons.Users className="h-6 w-6" />, color: "text-blue-400", desc: "User registry & permissions" },
             { label: "Oversight Queue", icon: <Icons.ShieldAlert className="h-6 w-6" />, color: "text-amber-400", desc: "Moderation & integrity" },
             { label: "Deep Intel", icon: <Icons.BarChart3 className="h-6 w-6" />, color: "text-emerald-400", desc: "Engagement telemetry" },
             { label: "Kernel Health", icon: <Icons.Cpu className="h-6 w-6" />, color: "text-indigo-400", desc: "Global system settings" }
           ].map((action, i) => (
             <motion.button 
               key={i}
               whileHover={{ y: -8, scale: 1.02 }}
               className="glass-dark border-white/5 p-10 rounded-[3rem] text-left transition-all hover:bg-white/10 group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden"
             >
               <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
               <div className={cn("h-16 w-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-inner", action.color)}>
                 {action.icon}
               </div>
               <h4 className="text-lg font-black text-white tracking-tight mb-2 uppercase heading">{action.label}</h4>
               <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-8">{action.desc}</p>
               <div className="flex items-center gap-3 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-emerald-400 transition-colors">
                  Execute Directive <Icons.ChevronRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
               </div>
             </motion.button>
           ))}
         </div>
      </section>

      {stats && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-dark border-white/10 rounded-[3.5rem] p-12 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.5)] space-y-12 bg-slate-900/60 backdrop-blur-3xl relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity scale-150">
                <Icons.Layers className="h-64 w-64" />
             </div>
             <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                   <h3 className="text-2xl font-black heading tracking-tighter text-white uppercase">Asset Distribution</h3>
                   <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none">Global inventory categorization matrix</p>
                </div>
                <div className="h-16 w-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-inner border border-indigo-500/20 group-hover:rotate-12 transition-transform duration-700">
                   <Icons.Layers className="h-8 w-8" />
                </div>
             </div>
             <div className="space-y-10 relative z-10">
               {[
                 { label: "Clinical Inquiries", value: stats.content.questions, color: "bg-blue-500", icon: <Icons.Info className="h-4 w-4" /> },
                 { label: "Protocol Solutions", value: stats.content.answers, color: "bg-emerald-500", icon: <Icons.CheckCircle2 className="h-4 w-4" /> },
                 { label: "Scholarly Resources", value: stats.content.resources, color: "bg-amber-500", icon: <Icons.BookOpen className="h-4 w-4" /> },
                 { label: "Strategic Groups", value: stats.content.studyGroups, color: "bg-indigo-500", icon: <Icons.Users className="h-4 w-4" /> }
               ].map((item, i) => (
                 <div key={i} className="space-y-4 group/item">
                   <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em]">
                     <span className="text-slate-400 flex items-center gap-3">
                        <div className={cn("h-1.5 w-1.5 rounded-full", item.color.replace('bg-', 'text-'))} />
                        {item.label}
                     </span>
                     <span className="text-white font-mono text-base">{formatNumber(item.value)}</span>
                   </div>
                   <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                      <motion.div 
                        initial={{ width: 0 }} 
                        whileInView={{ width: "75%" }} 
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={cn("h-full rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden", item.color)} 
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </motion.div>
                   </div>
                 </div>
               ))}
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-dark border-white/10 rounded-[3.5rem] p-12 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.5)] space-y-12 bg-slate-900/60 backdrop-blur-3xl relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity scale-150">
                <Icons.Monitor className="h-64 w-64" />
             </div>
             <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                   <h3 className="text-2xl font-black heading tracking-tighter text-white uppercase">Synchronization Pulse</h3>
                   <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none">Time-series engagement telemetry stream</p>
                </div>
                <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-inner border border-emerald-500/20 group-hover:rotate-12 transition-transform duration-700">
                   <Icons.Monitor className="h-8 w-8" />
                </div>
             </div>
             <div className="grid grid-cols-1 gap-6 relative z-10">
               {[
                 { label: "Total Direct Syncs", value: stats.engagement.totalInteractions, icon: <Icons.Sparkles className="h-5 w-5" /> },
                 { label: "Daily Sync Factor", value: stats.engagement.dailyActive, icon: <Icons.Activity className="h-5 w-5" /> },
                 { label: "Weekly Unit Load", value: stats.engagement.weeklyActive, icon: <Icons.Clock className="h-5 w-5" /> },
                 { label: "System Saturation", value: stats.engagement.monthlyActive, icon: <Icons.Database className="h-5 w-5" /> }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all group/subitem shadow-inner">
                    <div className="flex items-center gap-6">
                       <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover/subitem:text-emerald-400 group-hover/subitem:scale-110 transition-all shadow-inner">
                          {item.icon}
                       </div>
                       <div className="space-y-1">
                          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.label}</p>
                          <p className="text-sm font-black text-emerald-500 uppercase tracking-widest leading-none">Status: Nominal</p>
                       </div>
                    </div>
                    <span className="text-3xl font-black heading tracking-tighter text-white group-hover/subitem:text-emerald-400 transition-colors uppercase">{formatNumber(item.value)}</span>
                 </div>
               ))}
             </div>
          </motion.div>
        </div>
      )}

      {/* Architecture Integrity Hub */}
      {stats && (
        <section className="space-y-8">
          <div className="flex items-center gap-4 px-4">
             <Icons.ShieldCheck className="h-6 w-6 text-emerald-500" />
             <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Architectural Precision Matrix</h3>
          </div>
          <div className="glass-dark border-white/10 rounded-[4rem] p-12 lg:p-20 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.6)] relative overflow-hidden group bg-slate-900/80 backdrop-blur-3xl">
             <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity scale-[2] rotate-12">
                <Icons.Cpu className="h-96 w-96" />
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
               {[
                 { label: "Operational Uptime", value: formatPercentage(stats.system.uptime), icon: <Icons.Zap className="h-8 w-8 text-emerald-400" />, sub: "FAULT-TOLERANT_PROTOCOL" },
                 { label: "Signal Latency", value: `${stats.system.responseTime}ms`, icon: <Icons.Clock className="h-8 w-8 text-indigo-400" />, sub: "SUB-OPTIMAL_RANGE <200" },
                 { label: "System Fault Rate", value: formatPercentage(stats.system.errorRate), icon: <Icons.AlertTriangle className="h-8 w-8 text-rose-400" />, sub: "NOMINAL_TOLERANCE" },
                 { label: "Matrix Saturation", value: `${formatNumber(stats.system.storageUsed / 1024 / 1024)}MB`, icon: <Icons.Database className="h-8 w-8 text-amber-400" />, sub: "ARCHIVE_UTILIZATION" }
               ].map((stat, i) => (
                 <div key={i} className="text-center space-y-6 group/stat">
                   <div className="h-20 w-20 mx-auto rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 group-hover/stat:scale-110 group-hover/stat:border-emerald-500/30 transition-all duration-700 shadow-inner">
                      {stat.icon}
                   </div>
                   <div className="space-y-2">
                      <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">{stat.label}</p>
                      <p className="text-4xl font-black heading text-white tracking-tighter uppercase">{stat.value}</p>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">{stat.sub}</p>
                   </div>
                 </div>
               ))}
             </div>

             <div className="mt-20 flex flex-col xl:flex-row items-center justify-between gap-12 pt-12 border-t border-white/5">
                <div className="flex flex-col md:flex-row items-center gap-10">
                   <div className="flex items-center gap-4">
                      <div className="relative">
                         <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
                         <div className="h-3 w-3 rounded-full bg-emerald-500 relative shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                      </div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Master Kernel Status: <span className="text-emerald-400">Synchronized</span></span>
                   </div>
                   <div className="hidden md:block h-6 w-px bg-white/10" />
                   <div className="flex items-center gap-4">
                      <div className="h-3 w-3 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Protocol Version: <span className="text-indigo-400 font-mono">v.4.1_ELITE</span></span>
                   </div>
                </div>
                
                <div className="flex items-center gap-6 w-full xl:w-auto">
                   <button className="flex-1 xl:flex-none h-16 px-12 bg-white text-slate-900 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)] hover:bg-emerald-500 hover:text-white transition-all active:scale-95 group/btn relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                      <span className="relative z-10">Initiate System Integrity Audit</span>
                   </button>
                </div>
             </div>
          </div>
        </section>
      )}
    </div>
  );
}
