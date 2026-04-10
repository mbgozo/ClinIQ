"use client";

import { useState } from 'react';
import { 
  AdminDashboard, 
  ModerationQueue,
  useSystemStats,
  useSystemAlerts,
  useModerationQueue,
  useResolveModerationItem,
  useDismissModerationItem,
  useAdminPermissions,
  AdminRole,
  ModerationAction
} from '@cliniq/ui';
import { 
  BarChart3, 
  ShieldAlert, 
  Users, 
  PieChart, 
  Settings, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Search,
  Activity,
  Database,
  Cpu,
  RefreshCcw,
  Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'moderation' | 'users' | 'analytics' | 'settings'>('dashboard');
  
  const { data: stats } = useSystemStats();
  const { data: alerts } = useSystemAlerts();
  const { data: queue, isLoading: queueLoading } = useModerationQueue({ status: 'PENDING' });
  const { data: permissions } = useAdminPermissions();
  
  const resolveMutation = useResolveModerationItem();
  const dismissMutation = useDismissModerationItem();

  const handleResolveModeration = (itemId: string, action: ModerationAction, reason?: string) => {
    resolveMutation.mutate({ id: itemId, action, reason });
  };

  const handleDismissModeration = (itemId: string) => {
    dismissMutation.mutate(itemId);
  };

  const userRole = permissions?.admin?.role || AdminRole.ADMIN;
  const userPermissions = permissions?.allPermissions || [];

  const tabs = [
    { id: 'dashboard', label: 'Command', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'moderation', label: 'Oversight', icon: <ShieldAlert className="h-4 w-4" />, badge: queue?.total || 0 },
    { id: 'users', label: 'Personnel', icon: <Users className="h-4 w-4" /> },
    { id: 'analytics', label: 'Intelligence', icon: <PieChart className="h-4 w-4" /> },
    { id: 'settings', label: 'Core System', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-10 pb-24 max-w-7xl mx-auto">
      {/* Executive Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 w-fit">
            <Terminal className="h-3 w-3 text-slate-600" />
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Administrative Command Layer</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 heading">Operations Hub</h1>
          <p className="text-slate-500 max-w-xl text-lg leading-relaxed font-medium">
             Centralized executive interface for system oversight, content integrity, and architectural management.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Update</p>
              <p className="text-xs font-bold text-slate-900">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
           </div>
           <button className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-emerald-700 transition-all flex items-center gap-3">
              <Zap className="h-4 w-4 text-emerald-400" />
              Quick Directive
           </button>
        </div>
      </section>

      {/* Controller Navigation */}
      <section className="glass rounded-[2rem] p-4 border-white/40 shadow-xl overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-2 min-w-max">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "relative flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all",
                 activeTab === tab.id 
                   ? "bg-slate-900 text-white shadow-xl" 
                   : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
               )}
             >
               {tab.icon}
               {tab.label}
               {tab.badge && tab.badge > 0 && (
                 <span className="h-5 w-5 bg-red-500 text-white rounded-lg flex items-center justify-center text-[10px] shadow-sm transform translate-x-1">
                   {tab.badge}
                 </span>
               )}
               {activeTab === tab.id && (
                 <motion.div layoutId="tab-indicator" className="absolute inset-0 border-2 border-emerald-500/20 rounded-2xl pointer-events-none" />
               )}
             </button>
           ))}
        </nav>
      </section>

      {/* Main Command Layer */}
      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           transition={{ duration: 0.4, ease: "easeOut" }}
        >
           {/* Dashboard Tab */}
           {activeTab === 'dashboard' && (
             <AdminDashboard
               stats={stats}
               alerts={alerts || []}
               userRole={userRole}
               userPermissions={userPermissions}
             />
           )}

           {/* Moderation Tab */}
           {activeTab === 'moderation' && (
             <div className="space-y-8">
               <div className="flex items-center justify-between px-2">
                 <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-900 heading">Content Verification Pipeline</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active queue for intellectual integrity</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-bold text-slate-600 uppercase tracking-widest border border-slate-200">
                       Queue Depth: {queue?.total || 0} ITEMS
                    </div>
                    <button className="p-3 rounded-xl hover:bg-slate-100 transition-colors">
                       <RefreshCcw className="h-5 w-5 text-slate-400" />
                    </button>
                 </div>
               </div>
               
               <div className="glass rounded-[2.5rem] p-8 border-white/40 shadow-2xl relative overflow-hidden min-h-[400px]">
                  <ModerationQueue
                    queue={queue?.queue || []}
                    onResolve={handleResolveModeration}
                    onDismiss={handleDismissModeration}
                    loading={queueLoading}
                  />
               </div>
             </div>
           )}

           {/* Users Tab */}
           {activeTab === 'users' && (
             <div className="space-y-8">
               <div className="space-y-1 px-2">
                  <h2 className="text-xl font-bold text-slate-900 heading">Strategic Personnel Management</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Database of verified academic practitioners</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  {[
                    { label: "Aggregate Personnel", value: stats?.users.total || 0, color: "text-slate-900", icon: Users },
                    { label: "Active Nodes", value: stats?.users.active || 0, color: "text-emerald-600", icon: Activity },
                    { label: "Verified Credentials", value: stats?.users.verified || 0, color: "text-indigo-600", icon: ShieldCheck }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass rounded-3xl p-8 border-white/50 text-center shadow-xl hover:-translate-y-1 transition-all"
                    >
                      <div className={`h-12 w-12 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-slate-50`}>
                         <stat.icon className={cn("h-6 w-6", stat.color)} />
                      </div>
                      <div className={cn("text-4xl font-bold heading mb-1", stat.color)}>{stat.value.toLocaleString()}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </motion.div>
                  ))}
               </div>
               
               <div className="glass rounded-[2.5rem] p-10 border-white/40 bg-white/50 space-y-8">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                     <div className="relative flex-1 w-full max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Personnel search by identifier or base..." 
                          className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                        />
                     </div>
                     <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none h-14 px-6 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-slate-200">
                           Form Admin Entry
                        </button>
                        <button className="flex-1 md:flex-none h-14 px-6 glass border-slate-200 text-slate-900 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all">
                           Export Archives
                        </button>
                     </div>
                  </div>
               </div>
             </div>
           )}

           {/* Analytics Tab */}
           {activeTab === 'analytics' && (
             <div className="space-y-12">
               <div className="space-y-1 px-2 text-center md:text-left">
                  <h2 className="text-xl font-bold text-slate-900 heading">Synthesized Intelligence</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System-wide engagement telemetry and content pulse</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="glass rounded-[3rem] p-10 border-white/50 shadow-2xl space-y-10">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <h3 className="text-lg font-bold text-slate-900 heading">Personnel Retention</h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Node Telemetry</p>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm"><Activity className="h-5 w-5" /></div>
                   </div>
                   
                   <div className="space-y-6">
                     {[
                       { label: "Daily Active Nodes", value: stats?.engagement.dailyActive || 0, trend: "+4%" },
                       { label: "Weekly Strategic Sync", value: stats?.engagement.weeklyActive || 0, trend: "+12%" },
                       { label: "Monthly Aggregate Sync", value: stats?.engagement.monthlyActive || 0, trend: "+8%" }
                     ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between group">
                         <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{item.label}</span>
                         <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-slate-900">{item.value.toLocaleString()}</span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold">{item.trend}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                   <button className="w-full h-12 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                      View Deep Intel
                   </button>
                 </div>
                 
                 <div className="glass rounded-[3rem] p-10 border-white/50 shadow-2xl space-y-10">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <h3 className="text-lg font-bold text-slate-900 heading">Operational Output</h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manifested Intel Pulse</p>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm"><Database className="h-5 w-5" /></div>
                   </div>
                   
                   <div className="space-y-6">
                     {[
                       { label: "Clinical Inquiries", value: stats?.content.questions || 0, color: "emerald" },
                       { label: "Protocol Solutions", value: stats?.content.answers || 0, color: "indigo" },
                       { label: "Scholarly Assets", value: stats?.content.resources || 0, color: "amber" }
                     ].map((item, i) => (
                       <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                             <span>{item.label}</span>
                             <span className="text-slate-900">{item.value.toLocaleString()}</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: "65%" }} 
                                className={`h-full bg-emerald-500 rounded-full`} 
                             />
                          </div>
                       </div>
                     ))}
                   </div>
                   <button className="w-full h-12 glass border-slate-200 text-slate-900 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all">
                      Synthesize Progress Report
                   </button>
                 </div>
               </div>
             </div>
           )}

           {/* Settings Tab */}
           {activeTab === 'settings' && (
             <div className="space-y-12">
               <div className="space-y-1 px-2">
                  <h2 className="text-xl font-bold text-slate-900 heading">Architectural Blueprint</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global system configurations and kernel health</p>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                 <div className="lg:col-span-2 glass rounded-[3rem] p-10 border-white/50 shadow-2xl space-y-12">
                    <div className="space-y-8">
                       <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Terminal className="h-4 w-4" /> Global Policy Control
                       </h3>
                       <div className="space-y-8">
                         {[
                           { label: "Operational Lockdown", desc: "Initiate system-wide maintenance protocol", action: "Lockdown", active: false, type: "danger" },
                           { label: "Entry Authentication", desc: "Allow establishment of new user identities", action: "Active", active: true, type: "success" },
                           { label: "Dispatch Channels", desc: "Maintain system-wide communication relays", action: "Active", active: true, type: "success" }
                         ].map((item, i) => (
                           <div key={i} className="flex items-center justify-between group">
                              <div className="space-y-1">
                                 <p className="text-sm font-bold text-slate-900">{item.label}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter transition-colors group-hover:text-slate-500">{item.desc}</p>
                              </div>
                              <button className={cn(
                                "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm",
                                item.active ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-red-500 text-white hover:bg-red-600"
                              )}>
                                 {item.action}
                              </button>
                           </div>
                         ))}
                       </div>
                    </div>
                 </div>
                 
                 <div className="glass rounded-[3rem] p-10 bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none transform translate-x-1/2 -translate-y-1/2">
                       <Cpu className="h-64 w-64" />
                    </div>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                       <Activity className="h-4 w-4 text-emerald-400" /> Kernel Integrity
                    </h3>
                    <div className="grid grid-cols-2 gap-8">
                       {[
                         { label: "Uptime", value: `${stats?.system.uptime || 0}%`, icon: <Zap className="h-4 w-4 text-emerald-400" /> },
                         { label: "Signal Latency", value: `${stats?.system.responseTime || 0}ms`, icon: <Clock className="h-4 w-4 text-indigo-400" /> },
                         { label: "Fault Rate", value: `${stats?.system.errorRate || 0}%`, icon: <ShieldAlert className="h-4 w-4 text-red-400" /> },
                         { label: "Memory Usage", value: `${Math.round((stats?.system.storageUsed || 0) / 1024 / 1024)}MB`, icon: <Database className="h-4 w-4 text-amber-400" /> }
                       ].map((stat, i) => (
                         <div key={i} className="space-y-2">
                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                               {stat.icon} {stat.label}
                            </div>
                            <p className="text-xl font-bold heading">{stat.value}</p>
                         </div>
                       ))}
                    </div>
                    
                    <button className="mt-12 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
                       Architectural Audit
                    </button>
                 </div>
               </div>
             </div>
           )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
