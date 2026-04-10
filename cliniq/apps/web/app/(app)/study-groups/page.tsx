"use client";

import { useState } from "react";
import { 
  useStudyGroups, 
  useMyStudyGroups, 
  useCreateStudyGroup, 
  useJoinStudyGroup,
  StudyGroupCard 
} from "@cliniq/ui";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Lock, 
  X,
  RefreshCcw,
  Sparkles,
  ShieldCheck,
  UserPlus,
  ChevronDown,
  Activity
} from "lucide-react";
import { cn } from "@cliniq/ui/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function StudyGroupsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [filters, setFilters] = useState({
    categoryId: "",
    institution: "",
    privacy: "",
    cadence: "",
    search: "",
    hasSpace: false,
  });

  const { data: groupsData, isLoading, error } = useStudyGroups(filters);
  const { data: myGroups } = useMyStudyGroups();
  const createMutation = useCreateStudyGroup();
  const joinMutation = useJoinStudyGroup();

  const groups = groupsData?.groups || [];


  const handleCreateGroup = async (formData: any) => {
    try {
      await createMutation.mutateAsync(formData);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleJoinGroup = async (groupId: string, inviteCode?: string) => {
    try {
      await joinMutation.mutateAsync({ groupId, inviteCode });
      setShowJoinModal(false);
      setSelectedGroup(null);
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };

  const handleJoinClick = (group: any) => {
    if (group.privacy === 'PRIVATE') {
      setSelectedGroup(group);
      setShowJoinModal(true);
    } else {
      handleJoinGroup(group.id);
    }
  };

  const clearFilters = () => {
    setFilters({
      categoryId: "",
      institution: "",
      privacy: "",
      cadence: "",
      search: "",
      hasSpace: false,
    });
  };

  const myGroupIds = myGroups?.map(g => g.id) || [];

  return (
    <div className="space-y-24 pb-32">
       {/* Background Effects */}
       <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] pointer-events-none -z-10" />
       <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-emerald-500/5 blur-[120px] pointer-events-none -z-10" />

      {/* Header Section: "Tactical Overlook" */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative">
        <div className="space-y-6 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-white border border-slate-100 shadow-sm w-fit"
          >
            <Users className="h-4 w-4 text-indigo-600" />
            <span className="text-[11px] font-black text-indigo-700 uppercase tracking-[0.3em]">Operational Cohort Registry</span>
          </motion.div>
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
          >
             <h1 className="text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 heading leading-none mb-6">Collaboration Rings</h1>
             <p className="text-slate-500 text-xl font-medium leading-tight max-w-xl opacity-80">
               Establish or integrate into high-performance clinical cohorts designed for peer-validated mastery and collective intelligence scaling.
             </p>
          </motion.div>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => setShowCreateModal(true)}
          className="group flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] hover:shadow-emerald-500/20 active:scale-95 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          <Plus className="h-5 w-5 text-emerald-400 group-hover:rotate-90 transition-transform" />
          <span className="relative z-10">ARCHITECT COHORT</span>
        </motion.button>
      </section>

      {/* My Groups: Operational Units */}
      {myGroups && myGroups.length > 0 && (
        <section className="space-y-12">
          <div className="flex items-center justify-between px-6">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-3">
               <Sparkles className="h-5 w-5 text-emerald-500 animate-pulse" />
               Registered Active Units
            </h2>
            <div className="h-[1px] flex-1 bg-slate-100 ml-8 hidden md:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {myGroups.map((group, i) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <StudyGroupCard
                  group={group}
                  onManage={() => window.location.href = `/study-groups/${group.id}`}
                  showActions={true}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Discovery Matrix (Filter Hub) */}
      <section className="space-y-16">
        <div className="relative group">
           <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="glass rounded-[3.5rem] p-10 lg:p-14 border-white/60 shadow-2xl relative overflow-hidden bg-white/40 backdrop-blur-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                 <ShieldCheck className="h-40 w-40" />
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-center gap-12 relative z-10">
                 {/* Main Refinement Controller */}
                 <div className="flex-1 space-y-6">
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3 ml-2">
                       <Filter className="h-4 w-4" /> Discovery Refinement Engine
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="relative group/input">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" />
                          <input
                            type="text"
                            placeholder="COHORT IDENTIFIER..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100/50 rounded-2xl text-[13px] font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all shadow-inner placeholder:text-slate-300 placeholder:uppercase"
                          />
                       </div>
                       
                       <div className="relative">
                          <select
                            value={filters.privacy}
                            onChange={(e) => setFilters(prev => ({ ...prev, privacy: e.target.value }))}
                            className="w-full appearance-none px-6 py-5 bg-white border border-slate-100/50 rounded-2xl text-[13px] font-black focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all cursor-pointer shadow-inner uppercase tracking-widest text-slate-600"
                          >
                            <option value="">OMNI PRIVACY</option>
                            <option value="PUBLIC">🌍 Open Access</option>
                            <option value="PRIVATE">🔒 Classified</option>
                            <option value="INVITE_ONLY">📧 Restricted</option>
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                       </div>
   
                       <div className="relative">
                          <select
                            value={filters.cadence}
                            onChange={(e) => setFilters(prev => ({ ...prev, cadence: e.target.value }))}
                            className="w-full appearance-none px-6 py-5 bg-white border border-slate-100/50 rounded-2xl text-[13px] font-black focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all cursor-pointer shadow-inner uppercase tracking-widest text-slate-600"
                          >
                            <option value="">COHORT CADENCE</option>
                            <option value="DAILY">Daily Rounds</option>
                            <option value="WEEKLY">Weekly Briefings</option>
                            <option value="BI_WEEKLY">Bi-Weekly Sync</option>
                            <option value="MONTHLY">Monthly Overview</option>
                            <option value="AS_NEEDED">Ad-hoc Support</option>
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                       </div>
                    </div>
                 </div>
   
                 {/* Secondary Control Node */}
                 <div className="lg:w-fit space-y-6">
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Parameters</h2>
                    <div className="flex flex-wrap items-center gap-6">
                       <label className="flex items-center gap-4 px-6 py-4 bg-white border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all shadow-sm group/check">
                          <div className={cn(
                            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                            filters.hasSpace ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20" : "border-slate-200"
                          )}>
                             {filters.hasSpace && <Plus className="h-3.5 w-3.5 text-white stroke-[4]" />}
                          </div>
                          <input
                            type="checkbox"
                            checked={filters.hasSpace}
                            onChange={(e) => setFilters(prev => ({ ...prev, hasSpace: e.target.checked }))}
                            className="hidden"
                          />
                          <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Active Capacity</span>
                       </label>
                       
                       <button
                         onClick={clearFilters}
                         className="h-14 w-14 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm flex items-center justify-center group/reset active:scale-95"
                         title="Reset Matrix"
                       >
                         <RefreshCcw className="h-5 w-5 group-hover/reset:rotate-180 transition-transform duration-700" />
                       </button>
                    </div>
                 </div>
              </div>

              {/* Matrix Status Bar */}
              <div className="mt-12 flex justify-between items-center pt-10 border-t border-slate-100/50">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl">
                       <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                       Active Nodes: {groups.length}
                    </div>
                 </div>
                 
                 <div className="hidden lg:flex items-center gap-8">
                    <div className="flex items-center gap-3">
                       <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Neural Sync Active</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Discovery Grid Control */}
        <div className="flex items-center justify-between px-2">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.4em]">Sector Discovery Grid</h3>
           <div className="h-[1px] flex-1 bg-slate-100 ml-8" />
        </div>
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-4">
               <div className="h-12 w-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Scanning Global Cohorts...</p>
            </motion.div>
          ) : error ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-[2.5rem] border border-red-100 text-center px-6">
               <X className="h-12 w-12 text-red-500 mb-4" />
               <h3 className="text-xl font-bold text-slate-900 mb-2 heading">Search Protocol Failed</h3>
               <p className="text-slate-500 text-sm max-w-xs">An error occurred while synchronizing with the central registry. Protocol code: TSX-404.</p>
            </motion.div>
          ) : groups.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 glass rounded-[2.5rem] border-white/40 text-center px-6">
               <Users className="h-16 w-16 text-slate-200 mb-6" />
               <h3 className="text-2xl font-bold text-slate-900 mb-2 heading">Registry Empty</h3>
               <p className="text-slate-500 max-w-sm mb-10">No cohorts match your current operational requirements. Consider establishing a new unit to lead the way.</p>
               <button
                 onClick={() => setShowCreateModal(true)}
                 className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all"
               >
                 Initiate First Cohort
               </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {groups.map((group) => (
                 <StudyGroupCard
                   key={group.id}
                   group={{
                     ...group,
                     userRole: myGroupIds.includes(group.id) ? 'MEMBER' : undefined
                   }}
                   onJoin={handleJoinClick}
                   onManage={() => window.location.href = `/study-groups/${group.id}`}
                   showActions={true}
                 />
               ))}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Modals Overlay */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowCreateModal(false)} />
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg">
                <CreateGroupModal
                  onSubmit={handleCreateGroup}
                  onCancel={() => setShowCreateModal(false)}
                  isLoading={createMutation.isPending}
                />
             </motion.div>
          </motion.div>
        )}

        {showJoinModal && selectedGroup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowJoinModal(false)} />
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md">
                <JoinGroupModal
                  group={selectedGroup}
                  onSubmit={(inviteCode: string) => handleJoinGroup(selectedGroup.id, inviteCode)}
                  onCancel={() => setShowJoinModal(false)}
                  isLoading={joinMutation.isPending}
                />
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Create Group Modal Component (Redesigned)
function CreateGroupModal({ onSubmit, onCancel, isLoading }: any) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    institution: '',
    privacy: 'PUBLIC',
    cadence: 'WEEKLY',
    maxMembers: 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass rounded-[3rem] border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] p-12 overflow-hidden relative bg-white/40 backdrop-blur-3xl">
       <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-emerald-500 animate-gradient-x" />
       
       <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
             <h2 className="text-4xl font-black text-slate-900 heading tracking-tighter uppercase leading-none">Architect Cohort</h2>
             <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] opacity-60 flex items-center gap-2">
                <Plus className="h-3 w-3" /> Initialization Sequence
             </p>
          </div>
          <button 
            onClick={onCancel} 
            className="h-12 w-12 rounded-2xl bg-white border border-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center justify-center group/close"
          >
             <X className="h-6 w-6 group-hover:rotate-90 transition-transform" />
          </button>
       </div>

       <form onSubmit={handleSubmit} className="space-y-10">
          {/* Unit Designation */}
          <div className="group/input space-y-4">
             <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block transition-colors group-focus-within/input:text-emerald-600">
                Cohort Identifier
             </label>
             <div className="relative">
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={100}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-8 py-5 bg-white border border-slate-100/50 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all shadow-inner placeholder:text-slate-200 uppercase tracking-widest"
                  placeholder="E.G. NEUROLOGY ALPHA-6"
                />
             </div>
          </div>

          {/* Operational Mandate */}
          <div className="group/input space-y-4">
             <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block transition-colors group-focus-within/input:text-indigo-600">
                Mission Parameters
             </label>
             <div className="relative">
                <textarea
                  required
                  minLength={10}
                  maxLength={500}
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-8 py-5 bg-white border border-slate-100/50 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all shadow-inner placeholder:text-slate-200 resize-none leading-relaxed"
                  placeholder="Define the primary clinical objectives and collective goals of this unit..."
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
             {/* Protocol Selector */}
             <div className="group/input space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block">
                   Security Protocol
                </label>
                <div className="relative">
                   <select
                     value={formData.privacy}
                     onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.value }))}
                     className="w-full appearance-none px-8 py-5 bg-white border border-slate-100/50 rounded-2xl text-[13px] font-black focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all cursor-pointer shadow-inner uppercase tracking-widest text-slate-600"
                   >
                     <option value="PUBLIC">🌍 Open Access</option>
                     <option value="PRIVATE">🔒 Classified</option>
                     <option value="INVITE_ONLY">📧 Restricted</option>
                   </select>
                   <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
             </div>

             {/* Cadence Selector */}
             <div className="group/input space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block">
                   Sync Iteration
                </label>
                <div className="relative">
                   <select
                     value={formData.cadence}
                     onChange={(e) => setFormData(prev => ({ ...prev, cadence: e.target.value }))}
                     className="w-full appearance-none px-8 py-5 bg-white border border-slate-100/50 rounded-2xl text-[13px] font-black focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all cursor-pointer shadow-inner uppercase tracking-widest text-slate-600"
                   >
                     <option value="DAILY">Daily Pulse</option>
                     <option value="WEEKLY">Weekly Sync</option>
                     <option value="BI_WEEKLY">Bi-Weekly Phase</option>
                     <option value="MONTHLY">Monthly Audit</option>
                     <option value="AS_NEEDED">Reactive Drift</option>
                   </select>
                   <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
             {/* Capacity Logic */}
             <div className="group/input space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block">
                   Unit Capacity
                </label>
                <div className="relative">
                   <input
                     type="number"
                     min={2}
                     max={100}
                     value={formData.maxMembers}
                     onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: Number(e.target.value) }))}
                     className="w-full px-8 py-5 bg-white border border-slate-100/50 rounded-2xl text-sm font-black focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all shadow-inner text-center tracking-[0.2em]"
                   />
                </div>
             </div>

             {/* Institution Link */}
             <div className="group/input space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block">
                   Facility Link
                </label>
                <div className="relative">
                   <input
                     type="text"
                     value={formData.institution}
                     onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                     className="w-full px-8 py-5 bg-white border border-slate-100/50 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all shadow-inner placeholder:text-slate-200 uppercase"
                     placeholder="OPTIONAL CODE"
                   />
                </div>
             </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-20 rounded-[2rem] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.4em] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 group/submit relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/submit:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            {isLoading ? <RefreshCcw className="h-6 w-6 animate-spin text-emerald-400" /> : <ShieldCheck className="h-6 w-6 text-emerald-400 group-hover/submit:scale-110 transition-transform" />}
            <span className="relative z-10">{isLoading ? 'AUTHORIZING SEQUENCES...' : 'INITIALIZE COHORT'}</span>
          </button>
       </form>
    </div>
  );
}

// Join Group Modal Component (Redesigned)
function JoinGroupModal({ group, onSubmit, onCancel, isLoading }: any) {
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inviteCode);
  };

  return (
    <div className="glass rounded-[3rem] border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] p-12 overflow-hidden relative bg-white/40 backdrop-blur-3xl">
       <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-rose-500 via-indigo-600 to-rose-500 animate-gradient-x" />
       
       <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
             <h2 className="text-4xl font-black text-slate-900 heading tracking-tighter uppercase leading-none">Classified Entry</h2>
             <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] opacity-60 flex items-center gap-2">
                <Lock className="h-3 w-3" /> External Authentication
             </p>
          </div>
          <button 
            onClick={onCancel} 
            className="h-12 w-12 rounded-2xl bg-white border border-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center justify-center group/close"
          >
             <X className="h-6 w-6 group-hover:rotate-90 transition-transform" />
          </button>
       </div>

       <div className="bg-slate-900 rounded-[2.5rem] p-8 flex items-center gap-6 mb-12 border border-slate-800 shadow-2xl relative overflow-hidden group/card">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
          <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-xl group-hover/card:rotate-6 transition-transform duration-500">
             <ShieldCheck className="h-8 w-8 text-indigo-400" />
          </div>
          <div className="relative z-10 flex-1 min-w-0">
             <h4 className="font-black text-white text-xl uppercase tracking-tighter mb-1 truncate">{group.name}</h4>
             <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-indigo-300/60 text-[10px] font-black uppercase tracking-[0.2em]">{group.memberCount} / {group.maxMembers} PERSONNEL SYNCED</p>
             </div>
          </div>
       </div>

       <form onSubmit={handleSubmit} className="space-y-10">
          <div className="group/input space-y-6">
             <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] text-center block w-full transition-colors group-focus-within/input:text-indigo-600">
                Nexus Access Token
             </label>
             <div className="relative">
                <input
                  type="text"
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="w-full h-24 px-8 bg-white border-2 border-slate-100/50 rounded-3xl text-4xl font-mono font-black text-center tracking-[0.6em] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] text-slate-900"
                  placeholder="********"
                  maxLength={8}
                />
             </div>
             <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-widest leading-relaxed px-8 opacity-60">
                ENTRY REQUIRES VALID AUTHORIZATION FROM THE ACTIVE COHORT CORE.
             </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-20 rounded-[2rem] bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.4em] shadow-[0_30px_60px_-15px_rgba(99,102,241,0.4)] hover:bg-slate-900 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 group/submit relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/submit:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            {isLoading ? <RefreshCcw className="h-6 w-6 animate-spin" /> : <UserPlus className="h-6 w-6 text-indigo-300 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 transition-transform" />}
            <span className="relative z-10">{isLoading ? 'VERIFYING CREDENTIALS...' : 'AUTHENTICATE & JOIN'}</span>
          </button>
       </form>
    </div>
  );
}
