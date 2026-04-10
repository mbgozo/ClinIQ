"use client";

import { useState } from 'react';
import { 
  FileText, 
  Check, 
  X, 
  CloudUpload, 
  Link as LinkIcon, 
  Type, 
  AlignLeft, 
  Layers, 
  Calendar, 
  Tag as TagIcon, 
  ShieldCheck, 
  Sparkles,
  Zap,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';


const UploadIcon = () => (
   <CloudUpload className="h-12 w-12 text-emerald-500" />
);

interface ResourceUploadProps {
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ResourceUpload({ onSubmit, onCancel, isLoading = false }: ResourceUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    categoryId: '',
    course: '',
    year: '',
    tags: [] as string[],
    copyrightAck: false
  });
  const [tagInput, setTagInput] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFormData(prev => ({ ...prev, url: '' }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      setFormData(prev => ({ ...prev, url: '' }));
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = new FormData();
    if (file) submitData.append('file', file);
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'tags') {
        submitData.append(key, JSON.stringify(value));
      } else if (key === 'year') {
        submitData.append(key, value ? String(value) : '');
      } else {
        submitData.append(key, String(value));
      }
    });
    await onSubmit(submitData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="glass-dark rounded-[3.5rem] p-10 lg:p-14 max-w-2xl w-full border-white/10 shadow-3xl text-white relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
           <CloudUpload className="h-64 w-64 text-emerald-400" />
        </div>

        <div className="flex items-center justify-between mb-10 relative">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em]">Operational Contribution</span>
            </div>
            <h2 className="text-3xl font-bold heading tracking-tight">Sync New Asset</h2>
          </div>
          <button 
            onClick={onCancel}
            className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8 relative">
          {/* File Upload / URL Segment */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
               <Zap className="h-3 w-3 text-amber-500" /> Source Vector Selection
            </label>
            <div className="space-y-6">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2.5rem] p-10 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
              >
                {file ? (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                       <FileText className="h-8 w-8" />
                    </div>
                    <span className="text-sm font-bold text-white mb-1">{file.name}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{formatFileSize(file.size)}</span>
                  </motion.div>
                ) : (
                  <>
                    <div className="h-20 w-20 rounded-[1.8rem] bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all mb-4">
                       <UploadIcon />
                    </div>
                    <span className="text-sm font-bold text-white mb-2">Engage asset upload or drop vector</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] max-w-[280px] text-center">
                       PDF, DOC, DOCX, PPT, MP4, IMAGE - PEER VALIDATED ONLY
                    </span>
                  </>
                )}
              </label>
              
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-6">
                <div className="flex-1 h-[1px] bg-white/5" />
                <span>or provide digital link</span>
                <div className="flex-1 h-[1px] bg-white/5" />
              </div>
              
              <div className="relative group">
                 <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                 <input
                   type="url"
                   placeholder="https://nexus.archives.edu/asset"
                   value={formData.url}
                   onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                   className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-medium focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all outline-none placeholder:text-slate-700 disabled:opacity-30"
                   disabled={!!file}
                 />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Asset Designation</label>
              <div className="relative group">
                 <Type className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                 <input
                   type="text"
                   required
                   minLength={5}
                   maxLength={200}
                   value={formData.title}
                   onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                   className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-medium focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all outline-none placeholder:text-slate-700"
                   placeholder="e.g., PICU Ventilation Protocols"
                 />
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Clinical Context</label>
               <div className="relative group">
                  <Layers className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors pointer-events-none" />
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-10 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-900">Select Domain</option>
                    <option value="1" className="bg-slate-900">Anatomy & Physiology</option>
                    <option value="2" className="bg-slate-900">Pharmacology</option>
                    <option value="3" className="bg-slate-900">Medical-Surgical</option>
                    <option value="4" className="bg-slate-900">Pediatrics</option>
                    <option value="5" className="bg-slate-900">Obstetrics & Gynecology</option>
                  </select>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Course */}
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Academic Unit</label>
                <div className="relative group">
                   <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                   <input
                     type="text"
                     value={formData.course}
                     onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                     className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-medium focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all outline-none placeholder:text-slate-700"
                     placeholder="e.g., NURS 204"
                   />
                </div>
             </div>

             {/* Year */}
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Archive Year</label>
                <div className="relative group">
                   <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                   <input
                     type="number"
                     min="1950"
                     max={new Date().getFullYear()}
                     value={formData.year}
                     onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                     className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-medium focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all outline-none placeholder:text-slate-700"
                     placeholder={new Date().getFullYear().toString()}
                   />
                </div>
             </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center justify-between">
               Indexing Keywords
               <span className="text-[9px] lowercase opacity-50">(limit 10)</span>
            </label>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1 group">
                   <TagIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                   <input
                     type="text"
                     value={tagInput}
                     onChange={(e) => setTagInput(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                     className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-medium focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all outline-none placeholder:text-slate-700 disabled:opacity-30"
                     placeholder="Define search index..."
                     disabled={formData.tags.length >= 10}
                   />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || formData.tags.length >= 10}
                  className="h-14 px-8 rounded-2xl bg-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 disabled:opacity-30"
                >
                  Inject
                </button>
              </div>
              
              <AnimatePresence>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-1">
                    {formData.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-white transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Executive Summary</label>
            <div className="relative group">
               <AlignLeft className="absolute left-6 top-6 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
               <textarea
                 required
                 minLength={10}
                 maxLength={1000}
                 rows={4}
                 value={formData.description}
                 onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                 className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-14 pr-6 py-6 text-sm font-medium focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all outline-none placeholder:text-slate-700 resize-none"
                 placeholder="Provide the clinical rationale for this resource..."
               />
            </div>
          </div>

          {/* Copyright Acknowledgment */}
          <div className="px-1">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="mt-0.5 relative">
                <input
                  type="checkbox"
                  required
                  checked={formData.copyrightAck}
                  onChange={(e) => setFormData(prev => ({ ...prev, copyrightAck: e.target.checked }))}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all group-hover:scale-110",
                    formData.copyrightAck ? 'bg-emerald-500 border-emerald-500' : 'border-white/10 bg-white/5'
                  )}
                >
                  {formData.copyrightAck && <Check className="h-4 w-4 text-white" />}
                </div>
              </div>
              <div className="space-y-1">
                 <span className="block text-xs font-bold text-white uppercase tracking-wider">Clinical Integrity Mandate</span>
                 <span className="block text-[10px] font-medium text-slate-400 leading-normal max-w-sm lowercase">
                    By syncronizing this asset, I confirm full intellectual ownership or legitimate authorization for global distribution within the platform registry.
                 </span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-10 border-t border-white/5">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 h-14 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all active:scale-95 disabled:opacity-30"
            >
              Abort Contribution
            </button>
            <button
              type="submit"
              disabled={isLoading || (!file && !formData.url)}
              className="flex-1 h-14 rounded-2xl bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Transmit Asset
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
