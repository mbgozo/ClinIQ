"use client";

import { useState } from "react";
import { 
  useResources, 
  useCategories, 
  useCreateResource, 
  useDownloadResource, 
  useFlagResource,
  ResourceCard, 
  ResourceUpload 
} from "@cliniq/ui";
import { 
  Search, 
  Filter, 
  BookOpen, 
  Layers, 
  Calendar, 
  ChevronDown, 
  X,
  RefreshCcw,
  CloudUpload,
  Library
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResourcesPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: "",
    course: "",
    year: "",
    tags: [] as string[],
    search: "",
  });

  const { data: resourcesData, isLoading, error } = useResources({
    ...filters,
    year: filters.year ? parseInt(filters.year) : undefined
  });
  const { data: categories } = useCategories();
  const createMutation = useCreateResource();
  const downloadMutation = useDownloadResource();
  const flagMutation = useFlagResource();

  const resources = resourcesData?.resources || [];
  const total = resourcesData?.total || 0;

  const handleUpload = async (formData: FormData) => {
    try {
      await createMutation.mutateAsync(formData);
      setShowUploadModal(false);
    } catch (error) {
      console.error('Failed to upload resource:', error);
    }
  };

  const handleDownload = async (resourceId: string) => {
    try {
      const result = await downloadMutation.mutateAsync(resourceId);
      if (result.downloadUrl.startsWith('http')) {
        window.open(result.downloadUrl, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = '';
        link.click();
      }
    } catch (error) {
      console.error('Failed to download resource:', error);
    }
  };

  const handleFlag = async (resourceId: string) => {
    const reason = prompt('Reason for flagging this resource:');
    if (reason) {
      try {
        await flagMutation.mutateAsync({ id: resourceId, reason });
      } catch (error) {
        console.error('Failed to flag resource:', error);
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      categoryId: "",
      course: "",
      year: "",
      tags: [],
      search: "",
    });
  };

  return (
    <div className="space-y-24 pb-32">
       {/* Background Decorative Elemets */}
       <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-500/5 blur-[120px] pointer-events-none -z-10" />
       <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-500/5 blur-[120px] pointer-events-none -z-10" />

      {/* Header Section: "The Academic Vault" */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative">
        <div className="space-y-6 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-white border border-slate-100 shadow-sm w-fit"
          >
            <Library className="h-4 w-4 text-emerald-600" />
            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.3em]">Neural Knowledge Registry</span>
          </motion.div>
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
          >
             <h1 className="text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 heading leading-none mb-6">Academic Vault</h1>
             <p className="text-slate-500 text-xl font-medium leading-tight max-w-xl opacity-80">
               Access the world&apos;s most comprehensive repository of peer-validated clinical intelligence and high-fidelity nursing protocols.
             </p>
          </motion.div>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => setShowUploadModal(true)}
          className="group flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] hover:shadow-emerald-500/20 active:scale-95 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          <CloudUpload className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="relative z-10">CONTRIBUTE ASSET</span>
        </motion.button>
      </section>

      {/* Refinement Engine (Filter Bar) */}
      <section className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="glass rounded-[3.5rem] p-10 lg:p-14 border-white/60 shadow-2xl relative overflow-hidden bg-white/40 backdrop-blur-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
             <Layers className="h-40 w-40" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Search Engine */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
                 <Search className="h-3.5 w-3.5" /> Intelligence Inquiry
              </label>
              <div className="relative group/input">
                 <input
                   type="text"
                   placeholder="Diagnosis, protocol, drug..."
                   value={filters.search}
                   onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                   className="w-full pl-6 pr-6 py-5 bg-white border border-slate-100/50 rounded-2xl text-[13px] font-bold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all shadow-inner placeholder:text-slate-300 placeholder:uppercase placeholder:tracking-[0.2em]"
                 />
              </div>
            </div>

            {/* Specialization Refinement */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
                 <Filter className="h-3.5 w-3.5" /> Domain Sector
              </label>
              <div className="relative">
                <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full appearance-none pl-6 pr-12 py-5 bg-white border border-slate-100/50 rounded-2xl text-[13px] font-bold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all cursor-pointer shadow-inner uppercase tracking-widest text-slate-600"
                >
                  <option value="">UNIVERSAL ARCHIVE</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Academic Core */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
                 <BookOpen className="h-3.5 w-3.5" /> Academic Node
              </label>
              <div className="relative">
                 <input
                   type="text"
                   placeholder="e.g. PHARM_201"
                   value={filters.course}
                   onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                   className="w-full pl-6 pr-6 py-5 bg-white border border-slate-100/50 rounded-2xl text-[13px] font-bold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all shadow-inner placeholder:text-slate-300 placeholder:uppercase"
                 />
              </div>
            </div>

            {/* Temporal Index */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
                 <Calendar className="h-3.5 w-3.5" /> Temporal Sync
              </label>
              <div className="relative group/input">
                 <input
                   type="number"
                   placeholder={new Date().getFullYear().toString()}
                   value={filters.year}
                   onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                   className="w-full pl-6 pr-6 py-5 bg-white border border-slate-100/50 rounded-2xl text-[13px] font-bold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all shadow-inner placeholder:text-slate-200"
                 />
              </div>
            </div>
          </div>

          {/* Status Bar: Executive Overview */}
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-100/50 gap-6">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                  <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                  Assets Identified: {total}
               </div>
               {(filters.search || filters.categoryId || filters.course || filters.year) && (
                 <button
                   onClick={clearFilters}
                   className="flex items-center gap-2 text-[11px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-all hover:scale-105"
                 >
                   <RefreshCcw className="h-3.5 w-3.5" /> RESET ENGINE
                 </button>
               )}
            </div>
            
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Quantum Data Integrity Active</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: "High-Fidelity Display" */}
      <section className="relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="h-16 w-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin shadow-2xl" />
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Decrypting Vault Assets...</p>
          </div>
        ) : error ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 bg-rose-50 rounded-[4rem] border border-rose-100 text-center px-12 max-w-2xl mx-auto shadow-2xl">
            <X className="h-16 w-16 text-rose-500 mb-6" />
            <h3 className="text-3xl font-black text-slate-900 mb-3 heading tracking-tight">Access Protocol Failure</h3>
            <p className="text-slate-500 text-lg font-medium leading-tight max-w-md mb-8">An error occurred while synchronizing with the central registry. Please verify your authentication link or retry.</p>
            <button
               onClick={() => window.location.reload()}
               className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all"
            >
               Retry Synchronization
            </button>
          </motion.div>
        ) : resources.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 glass rounded-[4rem] border-white text-center px-12 shadow-3xl bg-white/20">
            <BookOpen className="h-24 w-24 text-slate-200 mb-8" />
            <h3 className="text-4xl font-black text-slate-900 mb-4 heading tracking-tight">Registry Void</h3>
            <p className="text-slate-600 text-xl font-medium max-w-lg mb-12 opacity-80 leading-tight">No intelligence nodes match your current refinement parameters. Establish the first validated record for this domain.</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-12 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95"
            >
              INITIALIZE CONTRIBUTION
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {resources.map((resource, i) => (
              <motion.div
                 key={resource.id}
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <ResourceCard
                  resource={resource}
                  onDownload={handleDownload}
                  onFlag={handleFlag}
                  showActions={true}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Upload Modal (Redesigned) */}
      <AnimatePresence>
        {showUploadModal && (
          <ResourceUpload
            onSubmit={handleUpload}
            onCancel={() => setShowUploadModal(false)}
            isLoading={createMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Added missing Lucide import
import { Activity } from "lucide-react";
