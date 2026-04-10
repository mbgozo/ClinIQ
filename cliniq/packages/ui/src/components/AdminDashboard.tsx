"use client";

import React from "react";
import * as Icons from "lucide-react";
import { 
  SystemStats, 
  SystemAlert, 
  AdminRole, 
  Permission,
  SystemAlertType
} from "@cliniq/shared-types";
import { cn } from "../lib/utils";

interface AdminDashboardProps {
  stats?: SystemStats;
  alerts: SystemAlert[];
  userRole: AdminRole;
  userPermissions: Permission[];
}

interface NeuralStatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  trend?: number;
}

const formatPercentage = (num: number) => {
  return num.toFixed(1) + '%';
};

const NeuralStatCard = ({ title, value, subtitle, icon: Icon, color, trend }: NeuralStatCardProps) => {
  return (
    <div className="relative group p-8 glass rounded-[2.5rem] border-white/40 shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
      <div className={cn("absolute -top-10 -right-10 h-32 w-32 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity", color)} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
           <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500", color, "bg-opacity-10")}>
              <Icon className={cn("h-7 w-7", color.replace('bg-', 'text-'))} />
           </div>
           {trend !== undefined && (
             <div className={cn("px-3 py-1 rounded-full text-[10px] font-black tracking-widest", trend >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                {trend >= 0 ? '+' : ''}{trend}%
             </div>
           )}
        </div>

        <div className="space-y-4">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</p>
           <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-slate-900 heading tracking-tighter">{value.toLocaleString()}</h3>
           </div>
           <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse" />
              {subtitle}
           </p>
        </div>
      </div>
    </div>
  );
};

export function AdminDashboard({ stats, alerts, userRole, userPermissions }: AdminDashboardProps) {
  const getSeverityIcon = (type: SystemAlertType) => {
    switch (type) {
      case SystemAlertType.ERROR: return <Icons.AlertCircle className="h-5 w-5" />;
      case SystemAlertType.WARNING: return <Icons.AlertTriangle className="h-5 w-5" />;
      case SystemAlertType.INFO: return <Icons.Info className="h-5 w-5" />;
      case SystemAlertType.MAINTENANCE: return <Icons.Settings className="h-5 w-5" />;
      default: return <Icons.Activity className="h-5 w-5" />;
    }
  };

  const dashboardStats = [
    { 
      title: "System Throughput", 
      value: stats?.system.responseTime || 0, 
      subtitle: "ms aggregate response", 
      icon: Icons.Cpu, 
      color: "bg-indigo-500", 
      trend: 12.4 
    },
    { 
      title: "Active Protocols", 
      value: stats?.content.questions || 0, 
      subtitle: "live synthesized inquiries", 
      icon: Icons.Zap, 
      color: "bg-emerald-500", 
      trend: 8.2 
    },
    { 
      title: "Intel Reserves", 
      value: formatPercentage(stats?.system.storageUsed ? (stats.system.storageUsed/1024/1024/1024) : 0),
      subtitle: "GB encrypted archives", 
      icon: Icons.Database, 
      color: "bg-amber-500", 
      trend: -1.4 
    },
    { 
      title: "Security Surface", 
      value: stats?.system.uptime || "99.9", 
      subtitle: "% operational integrity", 
      icon: Icons.ShieldCheck, 
      color: "bg-slate-900", 
      trend: 0 
    }
  ];

  return (
    <div className="space-y-12">
      {/* 1. Neural Intel Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {dashboardStats.map((stat, i) => (
          <NeuralStatCard key={i} {...stat} />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 2. Real-time Telemetry Stream */}
        <section className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
             <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 heading tracking-tight uppercase">Operational Logs</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time system event synthesis</p>
             </div>
             <button className="h-10 px-5 glass border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                Export Manifest
             </button>
          </div>

          <div className="glass rounded-[3rem] border-white/40 shadow-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 flex gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
             </div>
             
             <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                     <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <Icons.CheckCircle2 className="h-8 w-8 text-emerald-500" />
                     </div>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest">System baseline nominal</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className="group flex items-start gap-6 p-6 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                    >
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                        alert.type === SystemAlertType.ERROR ? "bg-red-50 text-red-500" : 
                        alert.type === SystemAlertType.WARNING ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-500"
                      )}>
                        {getSeverityIcon(alert.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{alert.title}</h4>
                           <span className="text-[10px] font-bold text-slate-400">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{alert.message}</p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded-lg transition-all">
                        <Icons.ChevronRight className="h-4 w-4 text-slate-400" />
                      </button>
                    </div>
                  ))
                )}
             </div>
          </div>
        </section>

        {/* 3. Executive Control Matrix */}
        <aside className="space-y-10">
           <div className="glass-dark bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-500/20 rounded-full blur-[60px]" />
              
              <div className="relative z-10 space-y-8">
                <div className="space-y-1">
                   <h3 className="text-lg font-black heading tracking-tight uppercase">Identity Context</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{userRole}</p>
                </div>

                <div className="space-y-6">
                   <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Active Privileges</p>
                   <div className="flex flex-wrap gap-2">
                      {userPermissions.slice(0, 6).map((perm, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-indigo-300 uppercase tracking-widest">
                           {perm.replace('_', ' ')}
                        </span>
                      ))}
                      {userPermissions.length > 6 && (
                        <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                           +{userPermissions.length - 6} MORE
                        </span>
                      )}
                   </div>
                </div>

                <div className="pt-6">
                   <button className="w-full h-14 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95 group/btn">
                      Secure Access Layer
                   </button>
                </div>
              </div>
           </div>

           <div className="glass rounded-[3rem] p-10 border-white/40 shadow-2xl space-y-8">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <Icons.TrendingUp className="h-6 w-6 text-emerald-600" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900 uppercase">Growth Pulse</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Node acquisition rate</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <div className="text-3xl font-black heading tracking-tighter text-slate-900">+1.2k</div>
                    <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mb-1">
                       <Icons.ArrowUpRight className="h-3 w-3" /> 24.8%
                    </div>
                 </div>
                 <div className="h-20 w-full flex items-end gap-1 px-1">
                    {[40, 60, 45, 70, 55, 85, 65, 95, 80, 100].map((h, i) => (
                      <div key={i} className="flex-1 bg-slate-100 rounded-sm group relative">
                        <div 
                          className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-sm transition-all duration-1000" 
                          style={{ height: `${h}%` }} 
                        />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
