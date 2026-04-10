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
  UserPlus
} from "lucide-react";
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
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 w-fit">
            <Users className="h-3 w-3 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Collaborative Learning</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 heading">Study Cohorts</h1>
          <p className="text-slate-500 max-w-xl text-lg leading-relaxed">
            Join or establish high-performance cohorts designed for peer-to-peer clinical mastery and systematic exam preparation.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-slate-200"
        >
          <Plus className="h-4 w-4" />
          Form Cohort
        </button>
      </section>

      {/* My Groups - Horizontal Scroll or Grid */}
      {myGroups && myGroups.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
               <Sparkles className="h-4 w-4 text-emerald-500" />
               Registered Active Units
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myGroups.map((group) => (
              <StudyGroupCard
                key={group.id}
                group={group}
                onManage={() => window.location.href = `/study-groups/${group.id}`}
                showActions={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Discovery Section with Filters */}
      <section className="space-y-10">
        <div className="glass rounded-[2rem] p-8 border-white/40 shadow-2xl relative overflow-hidden">
           <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              {/* Main Refinement Controller */}
              <div className="flex-1 space-y-4">
                 <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-400" /> Discovery Refinement
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative group">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                       <input
                         type="text"
                         placeholder="Cohort name or specialty..."
                         value={filters.search}
                         onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                         className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all"
                       />
                    </div>
                    
                    <div className="relative">
                       <select
                         value={filters.privacy}
                         onChange={(e) => setFilters(prev => ({ ...prev, privacy: e.target.value }))}
                         className="w-full appearance-none px-4 py-3 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                       >
                         <option value="">Universal Privacy</option>
                         <option value="PUBLIC">🌍 Open Access</option>
                         <option value="PRIVATE">🔒 Classified</option>
                         <option value="INVITE_ONLY">📧 Restricted</option>
                       </select>
                    </div>

                    <div className="relative">
                       <select
                         value={filters.cadence}
                         onChange={(e) => setFilters(prev => ({ ...prev, cadence: e.target.value }))}
                         className="w-full appearance-none px-4 py-3 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                       >
                         <option value="">Operational Cadence</option>
                         <option value="DAILY">Daily Rounds</option>
                         <option value="WEEKLY">Weekly Briefings</option>
                         <option value="BI_WEEKLY">Bi-Weekly Sync</option>
                         <option value="MONTHLY">Monthly Overview</option>
                         <option value="AS_NEEDED">Ad-hoc Support</option>
                       </select>
                    </div>
                 </div>
              </div>

              {/* Secondary Controls */}
              <div className="lg:w-fit space-y-4">
                 <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parameters</h2>
                 <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-3 px-4 py-2.5 bg-slate-100 rounded-xl cursor-pointer hover:bg-slate-200 transition-colors">
                       <input
                         type="checkbox"
                         checked={filters.hasSpace}
                         onChange={(e) => setFilters(prev => ({ ...prev, hasSpace: e.target.checked }))}
                         className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                       />
                       <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Active Capacity Only</span>
                    </label>
                    <button
                      onClick={clearFilters}
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                      title="Reset Filters"
                    >
                      <RefreshCcw className="h-5 w-5" />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Discovery Grid */}
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
    <div className="glass rounded-[2.5rem] border-white/40 shadow-2xl p-8 overflow-hidden relative">
       <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-indigo-500" />
       
       <div className="flex items-center justify-between mb-8">
          <div>
             <h2 className="text-2xl font-bold text-slate-900 heading">Form New Cohort</h2>
             <p className="text-slate-500 text-xs font-medium">Establish a high-performance learning unit.</p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
             <X className="h-5 w-5 text-slate-400" />
          </button>
       </div>

       <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unit Designation</label>
             <input
               type="text"
               required
               minLength={3}
               maxLength={100}
               value={formData.name}
               onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
               className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
               placeholder="e.g. Critical Care Alpha"
             />
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Operational Mandate</label>
             <textarea
               required
               minLength={10}
               maxLength={500}
               rows={3}
               value={formData.description}
               onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
               className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
               placeholder="Define the cohort's primary learning goals..."
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Protocol</label>
                <select
                  value={formData.privacy}
                  onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner cursor-pointer"
                >
                  <option value="PUBLIC">🌍 Open</option>
                  <option value="PRIVATE">🔒 Classified</option>
                  <option value="INVITE_ONLY">📧 Restricted</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cadence</label>
                <select
                  value={formData.cadence}
                  onChange={(e) => setFormData(prev => ({ ...prev, cadence: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner cursor-pointer"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="BI_WEEKLY">Bi-Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="AS_NEEDED">Ad-hoc</option>
                </select>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
                <input
                  type="number"
                  min={2}
                  max={100}
                  value={formData.maxMembers}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: Number(e.target.value) }))}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Base Facilty</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                  placeholder="Optional"
                />
             </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
            {isLoading ? 'Authorizing...' : 'Initialize Cohort'}
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
    <div className="glass rounded-[2.5rem] border-white/40 shadow-2xl p-8 overflow-hidden relative">
       <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-indigo-500" />
       
       <div className="flex items-center justify-between mb-8">
          <div>
             <h2 className="text-2xl font-bold text-slate-900 heading">Classified Entry</h2>
             <p className="text-slate-500 text-xs font-medium">Authentication required for restricted unit.</p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
             <X className="h-5 w-5 text-slate-400" />
          </button>
       </div>

       <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 mb-8 border border-slate-100">
          <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
             <Lock className="h-6 w-6" />
          </div>
          <div>
             <h4 className="font-bold text-slate-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{group.name}</h4>
             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{group.memberCount} / {group.maxMembers} Personnel Registered</p>
          </div>
       </div>

       <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Token</label>
             <input
               type="text"
               required
               value={inviteCode}
               onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
               className="w-full h-14 px-4 bg-slate-50 border-none rounded-xl text-lg font-mono font-bold text-center tracking-[0.5em] focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
               placeholder="8-SYMBOL"
               maxLength={8}
             />
             <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-tighter mt-4">
                Verify this code with the active group lead.
             </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
            {isLoading ? 'Verifying...' : 'Authenticate & Join'}
          </button>
       </form>
    </div>
  );
}
