"use client";

import { 
  SystemStats, 
  SystemAlert, 
  AdminRole, 
  Permission
} from '@cliniq/shared-types';
import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  BookOpen, 
  Clock, 
  Cpu, 
  Database, 
  Flag, 
  Layers, 
  ShieldAlert, 
  ShieldCheck, 
  Settings, 
  TrendingUp, 
  Users, 
  Zap,
  Info,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Monitor
} from "lucide-react";
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
      case 'INFO': return <Info className="h-5 w-5" />;
      case 'WARNING': return <AlertTriangle className="h-5 w-5" />;
      case 'ERROR': return <AlertCircle className="h-5 w-5" />;
      case 'SUCCESS': return <CheckCircle2 className="h-5 w-5" />;
      case 'MAINTENANCE': return <Settings className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
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
      className="glass-dark border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/20 transition-all group relative overflow-hidden shadow-3xl"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
         {icon}
      </div>
      
      <div className="flex flex-col h-full space-y-4">
        <div className="flex items-center justify-between">
           <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-inner", color)}>
              {icon}
           </div>
           {trend && (
             <div className={cn(
               "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
               trend.isPositive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
             )}>
               {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
               {formatPercentage(trend.value)}
             </div>
           )}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
          <p className={cn("text-3xl font-black heading tracking-tight text-white")}>{value}</p>
          {subtitle && (
            <p className="text-[10px] font-medium text-slate-500 italic mt-2">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={cn("space-y-12 pb-20", className)}>
      {/* Dynamic Alerts Matrix */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
               <ShieldAlert className="h-4 w-4 text-rose-500" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Critical System Broadcasts</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {alerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "relative border rounded-[2rem] p-6 lg:p-8 overflow-hidden group shadow-2xl",
                    getAlertStyles(alert.type)
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-start gap-6">
                      <div className="mt-1 h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                         {getAlertIcon(alert.type)}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-black heading tracking-tight text-white">{alert.title}</h3>
                        <p className="text-sm font-medium opacity-80 leading-relaxed max-w-3xl">{alert.message}</p>
                        <div className="flex items-center gap-4 pt-2">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 flex items-center gap-2">
                              <Clock className="h-3 w-3" /> Initiated {new Date(alert.startsAt).toLocaleTimeString()}
                           </span>
                           <div className="h-1 w-1 rounded-full bg-white/20" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Status: Active Broadcast</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all active:scale-90"
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

      {/* Quick Intelligence Directives */}
      {hasPermission(Permission.MANAGE_USERS) && (
        <section className="space-y-6">
           <div className="flex items-center gap-3 px-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Operational Directives</h3>
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { label: "Personnel Nexus", icon: <Users className="h-5 w-5" />, color: "text-blue-400", desc: "User registry & permissions" },
               { label: "Oversight Queue", icon: <ShieldAlert className="h-5 w-5" />, color: "text-amber-400", desc: "Moderation & integrity" },
               { label: "Deep Intel", icon: <BarChart3 className="h-5 w-5" />, color: "text-emerald-400", desc: "Engagement telemetry" },
               { label: "Kernel Health", icon: <Cpu className="h-5 w-5" />, color: "text-indigo-400", desc: "Global system settings" }
             ].map((action, i) => (
               <motion.button 
                 key={i}
                 whileHover={{ y: -5 }}
                 className="glass-dark border-white/5 p-6 rounded-[2.5rem] text-left transition-all hover:bg-white/5 group shadow-xl"
               >
                 <div className={cn("h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", action.color)}>
                   {action.icon}
                 </div>
                 <h4 className="text-sm font-black text-white tracking-[0.1em] mb-1">{action.label}</h4>
                 <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter leading-none">{action.desc}</p>
                 <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">
                    Access Directives <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                 </div>
               </motion.button>
             ))}
           </div>
        </section>
      )}

      {/* Global Intelligence Stats */}
      {stats && (
        <section className="space-y-6">
           <div className="flex items-center gap-3 px-2">
              <Activity className="h-4 w-4 text-indigo-500" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Core System Engagement</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <NeuralStatCard
               index={0}
               title="Aggregate Personnel"
               value={formatNumber(stats.users.total)}
               subtitle={`${formatNumber(stats.users.new)} newly established this cycle`}
               icon={<Users className="h-8 w-8" />}
               color="text-blue-400"
               trend={{ value: 12.5, isPositive: true }}
             />
             <NeuralStatCard
               index={1}
               title="Active Sync Nodes"
               value={formatNumber(stats.users.active)}
               subtitle={`${formatPercentage((stats.users.active / stats.users.total) * 100)} system establishment rate`}
               icon={<Activity className="h-8 w-8" />}
               color="text-emerald-400"
               trend={{ value: 8.2, isPositive: true }}
             />
             <NeuralStatCard
               index={2}
               title="Documented Assets"
               value={formatNumber(stats.content.questions + stats.content.answers + stats.content.resources)}
               subtitle={`${stats.content.questions} queries / ${stats.content.answers} solutions`}
               icon={<BookOpen className="h-8 w-8" />}
               color="text-indigo-400"
               trend={{ value: 15.3, isPositive: true }}
             />
             <NeuralStatCard
               index={3}
               title="Critical Flags"
               value={stats.moderation.pendingFlags}
               subtitle="Immediate directive required"
               icon={<Flag className="h-8 w-8" />}
               color="text-rose-400"
               trend={{ value: 5.1, isPositive: false }}
             />
           </div>
        </section>
      )}

      {/* Detailed Operations Grid */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass-dark border-white/5 rounded-[3rem] p-10 shadow-3xl space-y-8"
          >
             <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black heading tracking-tight text-white mb-1">Asset Distribution</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Global inventory categorization</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-inner">
                   <Layers className="h-6 w-6" />
                </div>
             </div>
             <div className="space-y-6">
               {[
                 { label: "Clinical Inquiries", value: stats.content.questions, color: "bg-blue-500" },
                 { label: "Protocol Solutions", value: stats.content.answers, color: "bg-emerald-500" },
                 { label: "Scholarly Resources", value: stats.content.resources, color: "bg-amber-500" },
                 { label: "Strategic Groups", value: stats.content.studyGroups, color: "bg-indigo-500" }
               ].map((item, i) => (
                 <div key={i} className="space-y-2">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.1em]">
                     <span className="text-slate-400">{item.label}</span>
                     <span className="text-white">{formatNumber(item.value)}</span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        whileInView={{ width: "65%" }} 
                        className={cn("h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]", item.color)} 
                      />
                   </div>
                 </div>
               ))}
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass-dark border-white/5 rounded-[3rem] p-10 shadow-3xl space-y-10"
          >
             <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black heading tracking-tight text-white mb-1">Synchronization Pulse</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Time-series engagement telemetry</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-inner">
                   <Monitor className="h-6 w-6" />
                </div>
             </div>
             <div className="space-y-6">
               {[
                 { label: "Total Direct Syncs", value: stats.engagement.totalInteractions, icon: <Sparkles className="h-4 w-4" /> },
                 { label: "Daily Sync Factor", value: stats.engagement.dailyActive, icon: <Activity className="h-4 w-4" /> },
                 { label: "Weekly Unit Load", value: stats.engagement.weeklyActive, icon: <Clock className="h-4 w-4" /> },
                 { label: "System Saturation", value: stats.engagement.monthlyActive, icon: <Database className="h-4 w-4" /> }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-3">
                       <div className="text-slate-500 group-hover:text-emerald-400 transition-colors uppercase tracking-widest text-[10px] font-black flex items-center gap-2">
                          {item.icon} {item.label}
                       </div>
                    </div>
                    <span className="text-lg font-black heading tracking-tight text-white">{formatNumber(item.value)}</span>
                 </div>
               ))}
             </div>
          </motion.div>
        </div>
      )}

      {/* Architecture Integrity Hub */}
      {stats && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
             <ShieldCheck className="h-4 w-4 text-emerald-500" />
             <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Architectural Precision Matrix</h3>
          </div>
          <div className="glass-dark border-white/5 rounded-[3.5rem] p-12 lg:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                <Cpu className="h-64 w-64 rotate-12" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
               {[
                 { label: "Operational Uptime", value: formatPercentage(stats.system.uptime), icon: <Zap className="h-6 w-6 text-emerald-400" />, sub: "Fault-tolerant" },
                 { label: "Signal Latency", value: `${stats.system.responseTime}ms`, icon: <Clock className="h-6 w-6 text-indigo-400" />, sub: "Sub-optimal <200" },
                 { label: "System Fault Rate", value: formatPercentage(stats.system.errorRate), icon: <AlertTriangle className="h-6 w-6 text-rose-400" />, sub: "Nominal range" },
                 { label: "Matrix Saturation", value: `${formatNumber(stats.system.storageUsed / 1024 / 1024)}mb`, icon: <Database className="h-6 w-6 text-amber-400" />, sub: "Archive utilization" }
               ].map((stat, i) => (
                 <div key={i} className="text-center space-y-4 group/stat">
                   <div className="h-14 w-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/stat:scale-110 transition-transform shadow-inner">
                      {stat.icon}
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-3xl font-black heading text-white tracking-tight">{stat.value}</p>
                      <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter italic">{stat.sub}</p>
                   </div>
                 </div>
               ))}
             </div>
             <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-white/5">
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Kernel: SYNCHRONIZED</span>
                   </div>
                   <div className="h-4 w-px bg-white/10" />
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispatch Protocol: v4.1 Elite</span>
                   </div>
                </div>
                <button className="h-14 px-10 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-3xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95">
                   Initiate System Integrity Audit
                </button>
             </div>
          </div>
        </section>
      )}
    </div>
  );
}
