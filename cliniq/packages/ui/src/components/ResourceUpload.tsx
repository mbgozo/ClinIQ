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
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-2xl flex items-center justify-center z-[110] p-6 lg:p-12 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 40 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-dark rounded-[4rem] p-12 lg:p-16 max-w-2xl w-full border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] text-white relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
           <CloudUpload className="h-80 w-80 text-emerald-400" />
        </div>

        <div className="flex items-center justify-between mb-12 relative">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em]">Vault Contribution Portal</span>
            </div>
            <h2 className="text-4xl font-black heading tracking-tight">Sync New Intelligence</h2>
          </div>
          <button 
            onClick={onCancel}
            className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90 border border-white/5"
          >
            <X className="h-7 w-7" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-10 relative">
          {/* File Upload / URL Segment */}
          <div className="space-y-5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 flex items-center gap-3">
               <Zap className="h-4 w-4 text-emerald-500" /> Selective Acquisition
            </label>
            <div className="space-y-8">
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
                className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[3rem] p-16 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/[0.02] to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {file ? (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center relative z-10">
                    <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 shadow-2xl border border-emerald-500/20">
                       <FileText className="h-10 w-10" />
                    </div>
                    <span className="text-lg font-black text-white mb-2 tracking-tight">{file.name}</span>
                    <span className="text-[11px] font-bold text-emerald-500/60 uppercase tracking-widest bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/10">{formatFileSize(file.size)}</span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center relative z-10">
                    <div className="h-24 w-24 rounded-[2rem] bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all duration-700 mb-6 shadow-inner border border-white/5">
                       <UploadIcon />
                    </div>
                    <span className="text-lg font-black text-white mb-3 tracking-tight">Engage target upload or drop vector</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] max-w-[320px] text-center leading-loose">
                       RECOGNIZED: PDF, DOCX, PPTX, MP4, JPEG, CLINICAL JSON
                    </span>
                  </div>
                )}
              </label>
              
              <div className="flex items-center gap-4 text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] px-8">
                <div className="flex-1 h-[1px] bg-white/[0.03]" />
                <span>External Access Node</span>
                <div className="flex-1 h-[1px] bg-white/[0.03]" />
              </div>
              
              <div className="relative group">
                 <LinkIcon className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                 <input
                   type="url"
                   placeholder="https://clinical.vault.iq/identifier"
                   value={formData.url}
                   onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                   className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-3xl pl-16 pr-8 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500/20 focus:bg-white/[0.04] transition-all outline-none placeholder:text-slate-800 disabled:opacity-20"
                   disabled={!!file}
                 />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Title */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Designation</label>
              <div className="relative group">
                 <Type className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                 <input
                   type="text"
                   required
                   minLength={5}
                   maxLength={200}
                   value={formData.title}
                   onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                   className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-3xl pl-16 pr-8 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500/20 focus:bg-white/[0.04] transition-all outline-none placeholder:text-slate-800"
                   placeholder="e.g., Hemodynamic Stability Matrix"
                 />
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-3">
               <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Clinical Domain</label>
               <div className="relative group">
                  <Layers className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors pointer-events-none" />
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-3xl pl-16 pr-12 text-sm font-black text-white focus:ring-2 focus:ring-emerald-500/20 focus:bg-white/[0.04] transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-950 font-sans">SELECT SECTOR</option>
                    <option value="1" className="bg-slate-950 font-sans">Anatomy & Physiology</option>
                    <option value="2" className="bg-slate-950 font-sans">Pharmacology</option>
                    <option value="3" className="bg-slate-950 font-sans">Medical-Surgical</option>
                    <option value="4" className="bg-slate-950 font-sans">Pediatrics</option>
                    <option value="5" className="bg-slate-950 font-sans">Obstetrics & Gynecology</option>
                  </select>
                  <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 transform rotate-90" />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {/* Course */}
             <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Academic Core</label>
                <div className="relative group">
                   <ShieldCheck className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                   <input
                     type="text"
                     value={formData.course}
                     onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                     className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-3xl pl-16 pr-8 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500/20 focus:bg-white/[0.04] transition-all outline-none placeholder:text-slate-800"
                     placeholder="ID: NURSING_CORE_2.0"
                   />
                </div>
             </div>

             {/* Year */}
             <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Temporal Index</label>
                <div className="relative group">
                   <Calendar className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                   <input
                     type="number"
                     min="1950"
                     max={new Date().getFullYear()}
                     value={formData.year}
                     onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                     className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-3xl pl-16 pr-8 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500/20 focus:bg-white/[0.04] transition-all outline-none placeholder:text-slate-800"
                     placeholder={new Date().getFullYear().toString()}
                   />
                </div>
             </div>
          </div>

          {/* Tags */}
          <div className="space-y-5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-2 flex items-center justify-between">
               Neural Indexing Keys
               <span className="text-[9px] lowercase opacity-30 font-bold">10-KEY LIMIT</span>
            </label>
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="relative flex-1 group">
                   <TagIcon className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                   <input
                     type="text"
                     value={tagInput}
                     onChange={(e) => setTagInput(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                     className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-3xl pl-16 pr-8 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500/20 focus:bg-white/[0.04] transition-all outline-none placeholder:text-slate-800 disabled:opacity-20"
                     placeholder="Inject keywords..."
                     disabled={formData.tags.length >= 10}
                   />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || formData.tags.length >= 10}
                  className="h-16 px-10 rounded-3xl bg-white/10 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500 hover:text-white transition-all active:scale-90 disabled:opacity-30 shadow-2xl"
                >
                  LINK
                </button>
              </div>
              
              <AnimatePresence>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-3 px-2">
                    {formData.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ scale: 0.8, opacity: 0, x: -10 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0.8, opacity: 0, x: 10 }}
                        className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-black text-emerald-400 uppercase tracking-widest shadow-xl"
                      >
                        <span className="opacity-50 text-[10px]">#</span>{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-white transition-colors p-1"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Operational Rationale</label>
            <div className="relative group">
               <AlignLeft className="absolute left-8 top-8 h-5 w-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
               <textarea
                 required
                 minLength={10}
                 maxLength={1000}
                 rows={5}
                 value={formData.description}
                 onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                 className="w-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] pl-16 pr-8 py-8 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500/20 focus:bg-white/[0.04] transition-all outline-none placeholder:text-slate-800 resize-none leading-relaxed"
                 placeholder="Define the critical necessity of this resource..."
               />
            </div>
          </div>

          {/* Copyright Acknowledgment */}
          <div className="px-3">
            <label className="flex items-start gap-5 cursor-pointer group">
              <div className="mt-1 relative">
                <input
                  type="checkbox"
                  required
                  checked={formData.copyrightAck}
                  onChange={(e) => setFormData(prev => ({ ...prev, copyrightAck: e.target.checked }))}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all group-hover:scale-110 shadow-2xl",
                    formData.copyrightAck ? 'bg-emerald-500 border-emerald-500 shadow-emerald-500/20' : 'border-white/10 bg-white/5'
                  )}
                >
                  {formData.copyrightAck && <Check className="h-5 w-5 text-white" strokeWidth={4} />}
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                 <span className="block text-sm font-black text-white uppercase tracking-widest leading-none">Security & Integrity Protocol</span>
                 <span className="block text-[10px] font-bold text-slate-500 leading-relaxed max-w-lg uppercase tracking-tight">
                    By initiating this sync, I verify compliance with the Sovereign Intelligence Protocol and assume liability for asset integrity and licensing.
                 </span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-6 pt-12 border-t border-white/[0.03]">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 h-18 rounded-[1.8rem] border border-white/10 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white/[0.02] transition-all active:scale-95 disabled:opacity-20 text-slate-500"
            >
              TERMINATE
            </button>
            <button
              type="submit"
              disabled={isLoading || (!file && !formData.url)}
              className="flex-1 h-18 rounded-[1.8rem] bg-emerald-500 text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_30px_60px_-15px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:shadow-emerald-500/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 relative overflow-hidden group/submit"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/submit:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              {isLoading ? (
                <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="relative z-10 font-black">SYNC TO VAULT</span>
                  <ChevronRight className="h-5 w-5 relative z-10" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
