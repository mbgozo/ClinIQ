"use client";

import { useState } from "react";
import { useMentors, MentorCard, useCreateMentorshipRequest } from "@cliniq/ui";
import { EXPERTISE_AREA_DEFINITIONS } from "@cliniq/shared-types";
import { 
  Search, 
  Filter, 
  Users, 
  Sparkles, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Star,
  Globe,
  GraduationCap,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";

export default function MentorsPage() {
  const [filters, setFilters] = useState({
    expertiseAreas: [] as string[],
    institution: "",
    verificationStatus: "",
    minRating: 0,
    availability: "",
    languages: [] as string[],
  });

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);

  const { data: mentorsData, isLoading, error } = useMentors(filters);
  const createRequestMutation = useCreateMentorshipRequest();

  const mentors = mentorsData?.mentors || [];
  const total = mentorsData?.total || 0;

  const handleExpertiseToggle = (area: string) => {
    setFilters(prev => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.includes(area)
        ? prev.expertiseAreas.filter(a => a !== area)
        : [...prev.expertiseAreas, area]
    }));
  };

  const handleLanguageToggle = (lang: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const handleRequestMentorship = (mentorId: string) => {
    const mentor = mentors.find(m => m.id === mentorId);
    setSelectedMentor(mentor);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (formData: any) => {
    if (!selectedMentor) return;

    try {
      await createRequestMutation.mutateAsync({
        mentorId: selectedMentor.id,
        topic: formData.topic,
        description: formData.description,
        urgency: formData.urgency,
        preferredTime: formData.preferredTime,
      });

      setShowRequestModal(false);
      setSelectedMentor(null);
      // Reset form
      (document.getElementById('mentorship-form') as HTMLFormElement)?.reset();
    } catch (error) {
      console.error('Failed to create mentorship request:', error);
    }
  };

  const commonLanguages = ['English', 'Twi', 'Ga', 'Ewe', 'Fante', 'Hausa', 'French'];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* Premium Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 w-fit">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Expert Guidance</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 heading">Elite Clinical Mentors</h1>
          <p className="text-slate-500 max-w-2xl text-lg leading-relaxed font-medium">
             Bridge the gap between theoretical knowledge and clinical mastery with directed guidance from verified nursing professionals.
          </p>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl shadow-slate-200 flex items-center gap-6">
           <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <Users className="h-7 w-7 text-emerald-400" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Faculty</p>
              <p className="text-3xl font-bold heading leading-none">{total}</p>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12">
        {/* Advanced Filters Sidebar */}
        <aside className="space-y-10">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                 <Filter className="h-4 w-4 text-emerald-500" />
                 Discovery Filters
              </h2>
              <button 
                onClick={() => setFilters({
                  expertiseAreas: [],
                  institution: "",
                  verificationStatus: "",
                  minRating: 0,
                  availability: "",
                  languages: [],
                })}
                className="text-[10px] font-bold text-slate-400 uppercase hover:text-emerald-600 transition-colors"
              >
                Reset All
              </button>
           </div>

           <div className="space-y-8 glass rounded-[2.5rem] p-8 border-white/40 shadow-xl shadow-slate-200/50">
              {/* Search */}
              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Base Institution</label>
                 <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search facility..." 
                      value={filters.institution}
                      onChange={(e) => setFilters(prev => ({ ...prev, institution: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                    />
                 </div>
              </div>

              {/* Expertise Checklist */}
              <div className="space-y-4">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Specialization</label>
                 <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                    {Object.entries(EXPERTISE_AREA_DEFINITIONS).map(([area, definition]) => (
                      <button
                        key={area}
                        onClick={() => handleExpertiseToggle(area)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border",
                          filters.expertiseAreas.includes(area)
                            ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-100"
                            : "bg-white text-slate-600 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30"
                        )}
                      >
                        <span className="text-base">{definition.icon}</span>
                        <span className="flex-1 text-left">{definition.name}</span>
                        {filters.expertiseAreas.includes(area) && <CheckCircle2 className="h-4 w-4" />}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Threshold Selection */}
              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Engagement Rating</label>
                 <select
                   value={filters.minRating}
                   onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                   className="w-full px-4 py-3 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 shadow-inner appearance-none transition-all cursor-pointer"
                 >
                   <option value={0}>Any Quality Score</option>
                   <option value={3}>3.0+ Mastery</option>
                   <option value={4}>4.0+ Professional</option>
                   <option value={4.5}>4.5+ Elite</option>
                 </select>
              </div>

              {/* Language Selection */}
              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Linguistic Proficiency</label>
                 <div className="flex flex-wrap gap-2">
                    {commonLanguages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageToggle(lang)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                          filters.languages.includes(lang)
                            ? "bg-emerald-100 text-emerald-700 font-bold"
                            : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           {/* Performance Tip Card */}
           <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
              <ShieldCheck className="h-10 w-10 mb-6 opacity-50" />
              <h3 className="text-xl font-bold mb-3 heading leading-tight">Elite Guidance Protocol</h3>
              <p className="text-indigo-100 text-xs font-medium leading-relaxed mb-8 opacity-80">
                 Verified mentors maintain a 98% satisfaction rate. Request specific clinical cases to maximize your learning sessions.
              </p>
              <button className="w-full py-4 bg-white text-indigo-700 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-50 transition-all active:scale-95">
                 Verification Logs
              </button>
           </div>
        </aside>

        {/* Mentors Results Grid */}
        <div className="space-y-8">
           <AnimatePresence mode="popLayout">
             {isLoading ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 gap-6">
                  <div className="h-16 w-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing Faculty Network...</p>
               </motion.div>
             ) : error ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 glass rounded-[3rem] text-center px-10">
                   <AlertCircle className="h-16 w-16 text-red-500 mb-6" />
                   <h3 className="text-2xl font-bold text-slate-900 heading mb-2">Network Synchronization Failure</h3>
                   <p className="text-slate-500 max-w-sm">Unable to establish a secure link with the professional directory node.</p>
                </motion.div>
             ) : mentors.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-40 glass rounded-[3rem] text-center px-10">
                   <div className="h-24 w-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-8">
                      <Search className="h-10 w-10 text-slate-200" />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900 heading mb-2">No Profiles Matched</h3>
                   <p className="text-slate-500 max-w-sm font-medium">No mentors currently match your strategic parameters. Expand your discovery range.</p>
                   <button 
                     onClick={() => setFilters({
                        expertiseAreas: [],
                        institution: "",
                        verificationStatus: "",
                        minRating: 0,
                        availability: "",
                        languages: [],
                      })}
                     className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all"
                   >
                     Reset Discovery Matrix
                   </button>
                </motion.div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {mentors.map((mentor, i) => (
                    <motion.div
                       key={mentor.id}
                       initial={{ opacity: 0, y: 30 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.05 }}
                    >
                       <MentorCard
                         mentor={mentor}
                         onRequestMentorship={handleRequestMentorship}
                       />
                    </motion.div>
                  ))}
                </div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Mentorship Request Modal */}
      <AnimatePresence>
        {showRequestModal && selectedMentor && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 lg:p-8">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowRequestModal(false)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative glass-dark rounded-[3rem] p-10 lg:p-12 w-full max-w-2xl border-white/10 shadow-3xl text-white overflow-hidden"
            >
               {/* Decorative background element */}
               <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transform translate-x-1/2 -translate-y-1/2">
                  <Target className="h-64 w-64 text-emerald-400" />
               </div>

               <div className="flex items-center justify-between mb-10 relative">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em]">Operational Directive</span>
                     </div>
                     <h3 className="text-3xl font-bold heading tracking-tight">
                       Proposal for {selectedMentor.user.name}
                     </h3>
                  </div>
                  <button 
                    onClick={() => setShowRequestModal(false)}
                    className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                  >
                    <X className="h-6 w-6" />
                  </button>
               </div>
               
               <form id="mentorship-form" className="space-y-8 relative" onSubmit={(e) => {
                 e.preventDefault();
                 const formData = new FormData(e.currentTarget);
                 handleSubmitRequest({
                   topic: formData.get('topic') as string,
                   description: formData.get('description') as string,
                   urgency: formData.get('urgency') as string,
                   preferredTime: formData.get('preferredTime') as string,
                 });
               }}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Specific Inquiry Topic</label>
                     <input
                       name="topic"
                       type="text"
                       required
                       placeholder="e.g., PICU Arterial Tension Protocol"
                       className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-medium focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all outline-none placeholder:text-slate-600"
                     />
                   </div>

                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Engagement Urgency</label>
                     <select
                       name="urgency"
                       required
                       className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all outline-none appearance-none cursor-pointer"
                     >
                       <option value="LOW" className="bg-slate-900">Normal Priority</option>
                       <option value="MEDIUM" className="bg-slate-900">Elevated Priority</option>
                       <option value="HIGH" className="bg-slate-900 text-red-400">Strategic Critical (ASAP)</option>
                     </select>
                   </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Session Mandate & Logistics</label>
                    <input
                      name="preferredTime"
                      type="text"
                      required
                      placeholder="Specify availability (e.g., Weekday Post-18:00 UTC)"
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-medium focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all outline-none placeholder:text-slate-600"
                    />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Briefing Description</label>
                   <textarea
                     name="description"
                     required
                     rows={4}
                     placeholder="Provide comprehensive details regarding your clinical guidance requirements..."
                     className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all outline-none placeholder:text-slate-600 resize-none"
                   />
                 </div>

                 <div className="flex gap-4 pt-6">
                   <button
                     type="button"
                     onClick={() => setShowRequestModal(false)}
                     className="flex-1 h-14 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
                   >
                     Abort Request
                   </button>
                   <button
                     type="submit"
                     disabled={createRequestMutation.isPending}
                     className="flex-1 h-14 rounded-2xl bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                   >
                     {createRequestMutation.isPending ? 'Syncing...' : (
                        <>
                          Transmit Proposal
                          <ChevronRight className="h-4 w-4" />
                        </>
                     )}
                   </button>
                 </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
