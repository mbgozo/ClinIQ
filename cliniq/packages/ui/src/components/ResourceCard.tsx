"use client";

import * as Icons from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    description?: string;
    url?: string;
    fileRef?: string;
    fileType?: string;
    course?: string;
    year?: number;
    downloads: number;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      avatarUrl?: string;
      institution: string;
    };
    category?: {
      id: string;
      name: string;
      icon: string;
      color: string;
    };
    isFlagged?: boolean;
  };
  onDownload?: (resourceId: string) => void;
  onFlag?: (resourceId: string) => void;
  onEdit?: (resourceId: string) => void;
  onDelete?: (resourceId: string) => void;
  showActions?: boolean;
  className?: string;
}

export function ResourceCard({ 
  resource, 
  onDownload, 
  onFlag, 
  onEdit, 
  onDelete, 
  showActions = true,
  className = '' 
}: ResourceCardProps) {
  const getFileIcon = (fileType?: string) => {
    switch (fileType) {
      case 'PRESENTATION': return <Icons.Presentation className="h-6 w-6" />;
      case 'VIDEO': return <Icons.Video className="h-6 w-6" />;
      case 'IMAGE': return <Icons.Image className="h-6 w-6" />;
      case 'AUDIO': return <Icons.Mic className="h-6 w-6" />;
      case 'LINK': return <Icons.Link className="h-6 w-6" />;
      case 'STUDY_GUIDE':
      case 'CHEAT_SHEET':
      case 'CASE_STUDY':
      case 'RESEARCH_PAPER':
      case 'CLINICAL_GUIDELINE': return <Icons.FileBadge className="h-6 w-6" />;
      default: return <Icons.FileText className="h-6 w-6" />;
    }
  };

  const getFileIconColors = (fileType?: string) => {
    switch (fileType) {
      case 'PRESENTATION': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'VIDEO': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'IMAGE': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'AUDIO': return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
      case 'LINK': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
      case 'STUDY_GUIDE':
      case 'CHEAT_SHEET':
      case 'CASE_STUDY':
      case 'RESEARCH_PAPER':
      case 'CLINICAL_GUIDELINE': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const isExternalLink = !!resource.url && !resource.fileRef;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "glass group border-white hover:border-emerald-300/50 transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_50px_100px_-20px_rgba(16,185,129,0.12)] rounded-[3rem] overflow-hidden flex flex-col relative bg-white/40 backdrop-blur-3xl",
        className
      )}
    >
      {/* Dynamic Visual Header */}
      <div className="relative h-32 bg-slate-50/50 group-hover:bg-slate-100/80 transition-colors duration-700">
         <div className="absolute inset-0 bg-grid-slate-200/[0.1] [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
         
         <div className={cn(
           "absolute top-8 left-10 h-16 w-16 rounded-[1.2rem] flex items-center justify-center shadow-2xl border-2 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 bg-white",
           getFileIconColors(resource.fileType)
         )}>
           {getFileIcon(resource.fileType)}
           <div className="absolute inset-0 rounded-[1.2rem] bg-indigo-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
         </div>
         
         <div className="absolute top-8 right-10">
            <div className="h-11 w-11 rounded-2xl glass border-white flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white cursor-pointer transition-all active:scale-90 shadow-sm">
               <Icons.MoreVertical className="h-5 w-5" />
            </div>
         </div>

         {/* Type Backdrop Text - Premium subtle watermark */}
         <div className="absolute -bottom-4 right-10 text-6xl font-black text-slate-200/20 select-none uppercase tracking-tighter opacity-10 transition-all duration-1000 group-hover:opacity-30 group-hover:translate-y-[-10px]">
            {resource.fileType?.split('_')[0] || 'Doc'}
         </div>
      </div>

      <div className="p-12 pt-10 flex-1 flex flex-col relative z-10">
        {/* Indicators Row */}
        <div className="flex items-center gap-4 mb-8">
          {resource.category && (
            <span className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100/50 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">
              <Icons.Layers className="h-3.5 w-3.5" /> {resource.category.name}
            </span>
          )}
          {resource.isFlagged && (
            <span className="flex items-center gap-2 px-4 py-1.5 bg-rose-50 border border-rose-100/50 rounded-full text-[10px] font-black text-rose-600 uppercase tracking-widest shadow-sm animate-pulse">
              <Icons.AlertTriangle className="h-3.5 w-3.5" /> Integrity Check
            </span>
          )}
        </div>

        {/* Core Asset Title */}
        <div className="space-y-6 mb-10">
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-slate-900 heading leading-[1.1] group-hover:text-emerald-800 transition-colors duration-500 max-w-[95%] tracking-tight">
              {resource.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              {resource.course && (
                <span className="flex items-center gap-2.5 px-3 py-1 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <Icons.Book className="h-4 w-4 text-indigo-500" /> {resource.course}
                </span>
              )}
              {resource.year && (
                <span className="flex items-center gap-2.5 px-3 py-1 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <Icons.History className="h-4 w-4 text-amber-500" /> Archival {resource.year}
                </span>
              )}
            </div>
          </div>
          
          {resource.description && (
            <p className="text-[15px] text-slate-500 font-medium leading-relaxed line-clamp-2 opacity-80">
              {resource.description}
            </p>
          )}
        </div>

        {/* Global Markers/Tags */}
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-12">
            {resource.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="text-[10px] font-bold px-4 py-2 bg-white/80 rounded-2xl text-slate-400 transition-all cursor-default border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 uppercase tracking-widest shadow-sm"
              >
                #{tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <div className="h-10 w-12 flex items-center justify-center bg-slate-50 rounded-2xl text-[10px] font-black text-slate-300 border border-slate-50 shadow-inner">
                +{resource.tags.length - 3}
              </div>
            )}
          </div>
        )}

        <div className="mt-auto space-y-10">
          {/* Attribution Nexus */}
          <div className="flex items-center justify-between py-8 border-t border-slate-100/50">
             <div className="flex items-center gap-5 group/author">
                <div className="h-14 w-14 rounded-[1.2rem] bg-white p-1 shadow-2xl border border-white ring-8 ring-slate-50/30 group-hover/author:ring-emerald-500/5 transition-all duration-700 relative overflow-hidden">
                   {resource.user.avatarUrl ? (
                     <img src={resource.user.avatarUrl} alt="" className="h-full w-full object-cover rounded-[0.9rem]" />
                   ) : (
                     <div className="h-full w-full flex items-center justify-center bg-slate-50 rounded-[0.9rem]">
                        <Icons.User className="h-7 w-7 text-slate-200" />
                     </div>
                   )}
                </div>
                <div className="space-y-1">
                   <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-none group-hover/author:text-emerald-600 transition-colors">{resource.user.name}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none truncate max-w-[160px]">{resource.user.institution}</p>
                </div>
             </div>
             
             <div className="text-right space-y-1.5">
                <div className="flex items-center justify-end gap-2">
                   <span className="text-xl font-black text-slate-900 tabular-nums">{resource.downloads.toLocaleString()}</span>
                   <Icons.Zap className="h-4 w-4 text-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">High-Fidelity Syncs</p>
             </div>
          </div>

          {/* Precision Controls */}
          {showActions && (
            <div className="flex gap-4">
              <button
                onClick={() => onDownload?.(resource.id)}
                className="flex-1 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:bg-emerald-600 transition-all active:scale-95 group/btn overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                {isExternalLink ? <Icons.ArrowUpRight className="h-5 w-5 text-emerald-400 relative z-10" /> : <Icons.Download className="h-5 w-5 text-emerald-400 relative z-10 group-hover/btn:translate-y-0.5 transition-transform" />}
                <span className="relative z-10">{isExternalLink ? 'Initiate Access' : 'Secure Sync'}</span>
              </button>
              
              <div className="flex gap-2 p-2 bg-slate-100/50 rounded-[1.5rem] border border-slate-100">
                {onEdit && (
                  <button onClick={() => onEdit(resource.id)} className="h-12 w-12 rounded-2xl glass border-white text-slate-400 hover:text-emerald-600 hover:bg-white transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95">
                    <Icons.Edit2 className="h-4 w-4" />
                  </button>
                )}
                <button 
                  onClick={() => onFlag?.(resource.id)} 
                  className={cn(
                    "h-12 w-12 rounded-2xl glass border-white transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95",
                    resource.isFlagged ? "text-rose-500 bg-rose-50" : "text-slate-400 hover:text-rose-600 hover:bg-white"
                  )}
                >
                  <Icons.Flag className="h-4 w-4" />
                </button>
                {onDelete && (
                  <button onClick={() => onDelete(resource.id)} className="h-12 w-12 rounded-2xl glass border-white text-slate-300 hover:text-rose-700 hover:bg-white transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95">
                    <Icons.Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
