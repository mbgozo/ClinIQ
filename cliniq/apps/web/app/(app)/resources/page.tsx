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
  Plus, 
  BookOpen, 
  Layers, 
  Calendar, 
  ChevronDown, 
  X,
  RefreshCcw,
  CloudUpload,
  Library,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

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
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 w-fit">
            <Library className="h-3 w-3 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Digital Repository</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 heading">Knowledge Vault</h1>
          <p className="text-slate-500 max-w-xl text-lg leading-relaxed">
            Exhaustive collection of peer-validated medical literature, study guides, and clinical protocols curated for nursing excellence.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-slate-200"
        >
          <CloudUpload className="h-4 w-4" />
          Contribute Asset
        </button>
      </section>

      {/* Advanced Filter Bar */}
      <section className="glass rounded-[2rem] p-8 border-white/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Library className="h-24 w-24" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Search */}
          <div className="lg:col-span-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Asset Search</label>
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
               <input
                 type="text"
                 placeholder="Diagnosis, drug guide..."
                 value={filters.search}
                 onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                 className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all"
               />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Specialization</label>
            <div className="relative">
              <select
                value={filters.categoryId}
                onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full appearance-none pl-4 pr-10 py-3 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Course Search */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Academic Unit</label>
            <div className="relative">
               <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <input
                 type="text"
                 placeholder="e.g. PHARM 201"
                 value={filters.course}
                 onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                 className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all"
               />
            </div>
          </div>

          {/* Year Select */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Academic Year</label>
            <div className="relative">
               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <input
                 type="number"
                 placeholder="2026"
                 value={filters.year}
                 onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                 className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all"
               />
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-8 flex justify-between items-center pt-8 border-t border-slate-50">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                <Filter className="h-3 w-3" />
                Filtered Results: {total}
             </div>
             {(filters.search || filters.categoryId || filters.course || filters.year) && (
               <button
                 onClick={clearFilters}
                 className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase hover:text-emerald-700 transition-colors"
               >
                 <RefreshCcw className="h-3 w-3" /> Reset Engine
               </button>
             )}
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Sync Active</span>
             </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-12 w-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Vault...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-[2.5rem] border border-red-100 text-center px-6">
            <X className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2 heading">Sync Interrupted</h3>
            <p className="text-slate-500 text-sm max-w-xs">We encountered an encryption error while retrieving the library contents. Please check your session link.</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 glass rounded-[2.5rem] border-white/40 text-center px-6">
            <BookOpen className="h-16 w-16 text-slate-200 mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2 heading">No Assets Found</h3>
            <p className="text-slate-500 max-w-sm mb-10">Adjust your refining filters or contribute the first peer-validated study guide to this unit.</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all"
            >
              First Contribution
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onDownload={handleDownload}
                onFlag={handleFlag}
                showActions={true}
              />
            ))}
          </motion.div>
        )}
      </section>

      {/* Upload Modal (Redesigned) */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowUploadModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl"
            >
              <ResourceUpload
                onSubmit={handleUpload}
                onCancel={() => setShowUploadModal(false)}
                isLoading={createMutation.isPending}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
